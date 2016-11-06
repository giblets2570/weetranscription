'use strict';
const angular = require('angular');

export class whyUsComponent {
  /*@ngInject*/
  constructor() {
    this.whys = [{
      class: 'piggy',
      text: 'Our superior trancription processes allows us to offer great prices, starting from £0.70 per minute.',
      title: 'Honest Pricing'
    },{
      class: 'quality',
      text: 'We believe high quality work is what keeps our clients happy. 100% money back guarantee is you aren\'t satisfied.',
      title: 'High quality'
    },{
      class: 'clock',
      text: 'Use our instant quote tool to price your transcription, upload the audio or video files directly from your computer and we do the rest.',
      title: 'Easy and fast'
    }]
  }
}

export default angular.module('transcribeApp.why-us', [])
  .component('whyUs', {
    template: require('./why-us.html'),
    bindings: {},
    controller: whyUsComponent
  })
  .name;
