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
    this.print = console.log;
    $scope.$watch(()=>this.time,(n,old)=>{
      this.changed = old !== this.time;
    }, true);
  }
  chooseFile(file){
    this.file = file;
    console.log(this.file);
  }
}

instantQuoteComponent.$inject = ['$scope'];

export default angular.module('transcribeApp.instant-quote', [])
  .component('instantQuote', {
    template: require('./instant-quote.html'),
    bindings: {
      base: '=',
      file: '='
    },
    controller: instantQuoteComponent
  })
  .name;
