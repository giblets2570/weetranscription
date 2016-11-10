'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    me: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    find: {
      method: 'GET',
      isArray: false,
      params: {
        id: 'find'
      }
    }
  });
}
