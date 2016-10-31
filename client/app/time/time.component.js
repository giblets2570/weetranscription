'use strict';
const angular = require('angular');

function twoDigits(number) {
  if(isNaN(number)){
    return "00";
  }
  if(number>9){
    return number.toString();
  }else{
    return `0${number.toString()}`;
  }
}

export class timeComponent {
  /*@ngInject*/
  constructor($scope) {
    $scope.$watch(() => this.seconds, () => {
      if(this.seconds){
        this.hours = twoDigits(Math.floor(this.seconds / 3600));
        this.minutes = twoDigits(Math.floor((this.seconds % 3600) / 60));
        this._seconds = twoDigits(Math.floor(this.seconds % 60));
      }
    },true);
  }
}

timeComponent.$inject = ["$scope"];

export default angular.module('transcribeApp.time', [])
  .component('time', {
    template: require('./time.html'),
    bindings: { seconds: '=' },
    controller: timeComponent
  })
  .name;
