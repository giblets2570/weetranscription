/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';

User.find({}).remove()
  .then(() => {
    User.create({
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@transcribe4.me',
      password: process.env.password
    })
    .then(() => {
      console.log('finished populating users');
    });
  });
