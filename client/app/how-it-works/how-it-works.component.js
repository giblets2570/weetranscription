'use strict';
const angular = require('angular');

export class howItWorksComponent {
  /*@ngInject*/
  constructor() {
    this.hows = [{
			class: 'upload',
      title: '1. Upload',
      text: 'Upload your audio file to our secure website'
    },{
			class: 'coffee',
      title: '2. Wait',
      text: 'Wait 24 hours or less for us to finish your transcription'
    },{
			class: 'envelope',
      title: '3. Receive an email',
      text: 'You will receive an email with your full transcription'
    },{
			class: 'done',
      title: '4. Enjoy transcription!',
      text: ''
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
