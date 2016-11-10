'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('thankyou', {
      url: '/:user_id/thankyou',
      template: '<thankyou></thankyou>'
    });
}
