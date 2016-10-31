'use strict';
const angular = require('angular');

export class whyUsComponent {
  /*@ngInject*/
  constructor() {
    this.whys = [{
      image: '/assets/images/piggy-bank.png',
      text: 'Our superiour trancription processes allows us to offer great prices, starting from £0.80 per minute.',
      title: 'Honest Pricing'
    },{
      image: '/assets/images/quality.png',
      text: 'We believe high quality work is what keeps our clients happy. 100% money back guarentee is you aren\'t satisfied.',
      title: 'High quality'
    },{
      image: '/assets/images/clock.png',
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
