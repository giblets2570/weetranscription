'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './terms.routes';

export class TermsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('transcribeApp.terms', [uiRouter])
  .config(routes)
  .component('terms', {
    template: require('./terms.html'),
    controller: TermsComponent,
    controllerAs: 'termsCtrl'
  })
  .name;
