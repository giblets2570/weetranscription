'use strict';

import User from './user.model';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

import co from 'co';

var stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY
);

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    console.error(err);
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  return User.find({}, '-salt -password').exec()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(handleError(res));
}

/**
 * Creates a new user
 */
export function create(req, res) {
  return co(function*(){
    if(req.body.token && req.body.token.id){
      // let stripe_charge = yield stripe.charges.create({
      //   amount: Math.floor(req.body.amount*(100 - req.body.discount) / 100.0),
      //   currency: "gbp",
      //   source: req.body.token.id, // obtained with Stripe.js
      //   description: `Charge for ${req.body.token.email}`
      // });
      let customer = yield stripeClient.customers.create({
        source: req.body.token.id,
        description: 'Saved details for '+req.body.token.email
      });
      let newUser = new User();
      newUser.stripe_customer_id = customer.id;
      newUser.email = req.body.token.email;
      newUser.audio = req.body.audio;
      newUser.stripe_charge_id = stripe_charge.id;
      newUser.provider = 'local';
      newUser.role = 'customer';
      newUser.price = req.body.amount;
      newUser.discount = req.body.discount;
      newUser.password = newUser.email;
      yield newUser.save()
      return newUser
    }else{
      var newUser = new User(req.body);
      newUser.provider = 'local';
      newUser.role = 'user';
      yield newUser.save()
      return newUser;
    }
  })
  .then(function(user) {
    var token = jwt.sign({ _id: user._id }, config.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({ token });
  })
  .catch(validationError(res));
}

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.findById(userId).exec()
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(err => next(err));
}

/**
 * Get a single user
 */
export function find(req, res, next) {
  let query = req.query || {};
  return User.findOne(query).exec()
    .then(user => {
      console.log(user);
      if(user) {
        return res.json({found: true});
      }else{
        return res.json({found: false});
      }
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a users password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.findById(userId).exec()
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.findOne({ _id: userId }, '-salt -password').exec()
    .then(user => { // don't ever give out the password or salt
      if(!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
