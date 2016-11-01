'use strict';

import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
// import ngValidationMatch from 'angular-validation-match';


import {
  routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import Modal from '../components/modal/modal.service';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import terms from './terms/terms.component';
import contact from './contact/contact.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';
import s3 from './s3/s3.service';
import reviews from './reviews/reviews.component';
import whyUs from './why-us/why-us.component';
import howItWorks from './how-it-works/how-it-works.component';
import time from './time/time.component';
import keen from './keen/keen.service';
import ngFileUpload from 'ng-file-upload';


import './app.scss';

angular.module('transcribeApp', [ngCookies, Modal, ngAnimate, ngResource, ngSanitize, 'btford.socket-io', uiRouter,
  uiBootstrap, _Auth, account, admin, navbar, footer, main, constants, socket, util , ngFileUpload, 
  s3, reviews, whyUs, time, keen, terms, contact, howItWorks
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['transcribeApp'], {
      strictDi: true
    });
  });
