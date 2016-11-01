'use strict';
const angular = require('angular');

export class howItWorksComponent {
  /*@ngInject*/
  constructor() {
    this.hows = [{
			image: '/assets/images/upload.png',
      title: '1. Upload your file'
    },{
			image: '/assets/images/coffee-cup.png',
      title: '2. Wait 24 hours'
    },{
			image: '/assets/images/envelope.png',
      title: '3. Receive an email'
    },{
			image: '/assets/images/round-done-button.png',
      title: '4. Enjoy transcription!'
    }]
  }
}

export default angular.module('transcribeApp.how-it-works', [])
  .component('howItWorks', {
    template: require('./how-it-works.html'),
    bindings: {},
    controller: howItWorksComponent
  })
  .name;
