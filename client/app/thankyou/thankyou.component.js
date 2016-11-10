'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './thankyou.routes';

export class ThankyouComponent {
  /*@ngInject*/
  constructor($state,$stateParams,User,ngAudio) {
    this.user = User.get({id: $stateParams.user_id});
    this.user.$promise.catch((err) => {
      $state.go('main');
    });
    this.user.$promise.then(_=>{
      this.user.audio = ngAudio.load(this.user.audio)
    })
    console.log(this.user);
  }
}

ThankyouComponent.$inject = ['$state','$stateParams','User','ngAudio'];


export default angular.module('transcribeApp.thankyou', [uiRouter])
  .config(routes)
  .component('thankyou', {
    template: require('./thankyou.html'),
    controller: ThankyouComponent
  })
  .name;
