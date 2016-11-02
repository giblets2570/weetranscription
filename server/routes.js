/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import s3 from './components/s3';
import path from 'path';

// Keen io code
let keen = require('keen.io').configure({
  projectId: process.env.KEEN_PROJECT_ID,
  writeKey: process.env.KEEN_WRITE_KEY,
  readKey: process.env.KEEN_READ_KEY
});

export default function(app) {

  // Redirect all HTTP traffic to HTTPS
  var ensureSecure = function(req, res, next) {
    // req.connection._peername.address is for testing distrbution on localhost
    if(req.headers["x-forwarded-proto"] === "https" || req.connection._peername.address === '127.0.0.1'){
      // OK, continue
      return next();
    }else{
      return res.redirect(301,'https://'+req.hostname+req.url);
    }
  };

  // Handle environments
  if (process.env.NODE_ENV === 'production') {
    app.all('*', ensureSecure);
  }

  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.post('/api/keen', (req,res) => {
    keen.addEvent(req.body.name, req.body.object, (err, response) => {
      if (err) return res.status(500).json(err);
      return res.json(response);
    });
  });

  app.get('/api/keen/keys', (req,res) => {
    return res.json({keenProjectId: process.env.KEEN_PROJECT_ID, keenReadKey: process.env.KEEN_READ_KEY})
  })

  app.get('/api/stripe', (req,res) => {
    return res.json(process.env.STRIPE_PUBLISHABLE_KEY);
  });

  app.use('/auth', require('./auth').default);

  app.get('/api/s3policy', (req,res) => {
    try{
      if(!req.query.bucket_name) throw {message: "Please provide a bucket name"}
      var policy = s3(req.query.bucket_name);
      return res.json(policy);
    }catch(err){
      return res.status(500).json(err);
    }
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
    });
}
