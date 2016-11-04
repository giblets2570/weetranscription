'use strict';
const angular = require('angular');

export class instantQuoteComponent {
  /*@ngInject*/
  constructor($scope) {
    this.time = 30*60 ;
    this.options = {
      floor: 0,
      ceil: 14400
    }
  }
}

instantQuoteComponent.$inject = ['$scope'];

export default angular.module('transcribeApp.instant-quote', [])
  .component('instantQuote', {
    template: require('./instant-quote.html'),
    bindings: {
      base: '='
    },
    controller: instantQuoteComponent
  })
  .name;
