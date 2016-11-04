'use strict';
const angular = require('angular');

export class timeComponent {
  /*@ngInject*/
  constructor() {

  }

  twoDigits(number) {
    if(isNaN(number)){
      return "00";
    }
    number = Math.floor(number)
    if(number>9){
      return number.toString();
    }else{
      return `0${number.toString()}`;
    }
  }
}

export default angular.module('transcribeApp.time', [])
  .component('time', {
    template: require('./time.html'),
    bindings: { seconds: '=' },
    controller: timeComponent
  })
  .name;
