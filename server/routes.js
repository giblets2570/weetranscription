/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import s3 from './components/s3';
import path from 'path';

// Keen io code
let keen = require('keen.io').configure({
  projectId: '58189a538db53dfda8a7697e',
  writeKey: '7EAF765BCF3283E1DC1B3AE5367667330BE5CE411E918B43F25CBCDE2C39E4646E1F76B58499743DFEA814CC4D73448A5E1681B4DFA2BC6EFF9F0A8F8C3A7BAB9B0959D2791CA3028749F6401881E2D420B9CF908C45043A8F7BD8400821DCF4',
  readKey: 'B64B0AE5A87374080D16E4F49929ACAC60BFF5DEFF1A9792C6A5F8023BFA86490406C1ED7557110E049623AF5339F5E699F603CD4E5AF0B6AC76D4FB20382FADA1B3253DA7C794EA81821E547F0CB4AC7C7C37733281BBFEF7E609B88E226BA4'
});

export default function(app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.post('/api/keen', (req,res) => {
    keen.addEvent(req.body.name, req.body.object, (err, response) => {
      if (err) return res.status(500).json(err);
      return res.json(response);
    });
  });

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
