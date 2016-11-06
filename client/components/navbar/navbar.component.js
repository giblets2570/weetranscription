'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Home',
    state: 'main'
  },{
    title: 'Our reviews',
    id: 'reviews',
  },{
    title: 'Why choose us',
    id: 'why-us',
  },{
    title: 'How it works',
    id: 'how-it-works',
  },{
    title: 'Cost calculator',
    id: 'instant',
  }];

  isCollapsed = true;

  constructor($scope,$state,$location,$timeout,Auth,anchorSmoothScroll) {
    'ngInject';
    this.state = '';
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.scrollTo = (id) => {
      anchorSmoothScroll.scrollTo(id);
      $timeout(()=>$location.hash(id));
    };

    $scope.$watch(()=>$state.current.name,(state) => {
      this.state = state;
    })

  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.html'),
    controller: NavbarComponent
  })
  .name;
