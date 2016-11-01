'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './contact.routes';

export class ContactComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('transcribeApp.contact', [uiRouter])
  .config(routes)
  .component('contact', {
    template: require('./contact.html'),
    controller: ContactComponent,
    controllerAs: 'contactCtrl'
  })
  .name;
