'use strict';
const angular = require('angular');

export class reviewsComponent {
  /*@ngInject*/
  constructor() {
    this.reviews = [{
      class: 'dad',
      text: '“Being able to easily transcribe my recordings has been an amazing timesaver.”',
      name: 'John Murray',
      occupation: 'Solicitor'
    },{
      class: 'george',
      text: '“We reviewed the transcript and we were happy with the accuracy given the accent of the speaker. Good work.”',
      name: 'George Clarke',
      occupation: 'English teacher'
    }]
  }
}

export default angular.module('transcribeApp.reviews', [])
  .component('reviews', {
    template: require('./reviews.html'),
    bindings: {},
    controller: reviewsComponent
  })
  .name;
