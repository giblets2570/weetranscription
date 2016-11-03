'use strict';

import angular from 'angular';

export function Modal($rootScope, $uibModal) {
    /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  var modalFactory = {};

  function openModal(scope, modalClass) {
    var modalScope = $rootScope.$new();
    scope = scope || {};
    modalClass = modalClass || 'modal-default';

    angular.extend(modalScope, scope);

    return $uibModal.open({
      templateUrl: 'components/modal/modal.html',
      windowClass: modalClass,
      scope: modalScope
    });
  }

  function createController(input){
    input = input || {};
    return function DialogController($scope, $mdDialog) {

      angular.extend($scope,input);

      $scope.hide = $mdDialog.hide;

      $scope.cancel = $mdDialog.cancel

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }
  }


  modalFactory.success = function(scope){

    scope = scope || {modal:{}};
    var classes = 'modal-success';

    scope.modal.dismissable = true;
    var modal = openModal(scope,classes);
    scope.modal.buttons = [
      {
        classes: 'btn-success',
        text: scope.modal.success || 'Ok',
        click: function(e,data) {
          console.log(data);
          modal.close(e);
        }
      }
    ];
    return modal;

  };

  modalFactory.create = function(scope,success){
    console.log(scope);
    scope = scope || {modal:{}};
    success = success || angular.noop;
    var classes = 'modal-primary ';
    if(scope.classes) classes += scope.classes.join(' ');

    scope.modal.dismissable = true;
    var modal = openModal(scope,classes);
    scope.modal.buttons = [
      {
        classes: 'btn-success',
        text: scope.modal.success || 'Create',
        click: function(e,data) {
          success(scope);
          modal.close(e);
        },
        hide: scope.modal.hide || function(){ return false; }
      },{
        classes: 'btn-default',
        text: 'Cancel',
        click: function(e) {
          modal.close(e);
        }
      }
    ];
    return modal;

  };



  modalFactory.remove = function(scope,confirm){

    scope = scope || {modal:{}};
    confirm = confirm || angular.noop;
    var classes = 'modal-danger';

    scope.modal.dismissable = true;
    var modal = openModal(scope,classes);
    scope.modal.buttons = [
      {
        classes: 'btn-danger',
        text: scope.modal.danger || 'Delete',
        click: function(e) {
          confirm(scope);
          modal.close(e);
        }
      },{
        classes: 'btn-default',
        text: 'Cancel',
        click: function(e) {
          modal.close(e);
        }
      }
    ];
    return modal;

  };

  modalFactory.danger = function(scope,next){

    scope = scope || {modal:{}};
    next = next || angular.noop;
    var classes = 'modal-danger';

    scope.modal.dismissable = false;
    var modal = openModal(scope,classes);
    scope.modal.buttons = [
      {
        classes: 'btn-default',
        text: 'Ok',
        click: function(e) {
          next();
          modal.close(e);
        }
      }
    ];
    return modal;

  };

  return modalFactory;
}

Modal.$inject = ["$rootScope", "$uibModal"];

export default angular.module('transcribeApp.Modal', [])
  .factory('Modal', Modal)
  .name;
