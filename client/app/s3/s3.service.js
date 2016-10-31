'use strict';
const angular = require('angular');

/*@ngInject*/
export function s3Service($http,$q,Upload) {
	// AngularJS will instantiate a singleton by calling "new" on this function

  this.getDuration = function(file){
    return Upload.mediaDuration(file)
  }

	this.sendFile = function(file){
    let bucket_name = 'transcribe4me';
    console.log(file);

    return $http({
      method:'GET',
      url:'/api/s3policy',
      params: {
        bucket_name: bucket_name
      },
      cache: false
    })
    .then((response) => {
      console.log(response);
      let data = response.data;
      var ext = '.'+file.name.split('.').pop();
      var filename = (new Date()).getTime()+ext;
      return Upload.upload({
        url: `https://${bucket_name}.s3-eu-west-1.amazonaws.com/`, //S3 upload url including bucket name
        method: 'POST',
        data: {
          key: 'uploads/'+filename, // the key to store the file on S3, could be file name or customized
          AWSAccessKeyId: data.key,
          acl: 'public-read', // sets the access to the uploaded file in the bucket: private, public-read, ...
          policy: data.policy, // base64-encoded json policy (see article below)
          signature: data.signature, // base64-encoded signature based on policy string (see article below)
          "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
          // filename: file.name, // this is needed for Flash polyfill IE8-9
          file: file
        }
      });
    })
  }
}

export default angular.module('transcribeApp.s3', [])
  .service('s3', s3Service)
  .name;
