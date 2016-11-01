'use strict';
const angular = require('angular');

/*@ngInject*/
export function keenService($http) {
	this.log = (name,object) => {
        return $http({
			method:'POST',
			url:'/api/keen',
			data:{
				name: name,
				object: object
			}
        });
    };
};

export default angular.module('transcribeApp.keen', [])
  .service('keen', keenService)
  .name;
