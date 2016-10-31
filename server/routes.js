/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import s3 from './components/s3';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

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
