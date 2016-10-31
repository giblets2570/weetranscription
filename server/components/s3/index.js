// Amazon stuff
let crypto = require('crypto');

function s3instance(accessKey, secretKey) {

  this.accessKey = accessKey;
  this.secretKey = secretKey;

  this.writePolicy = function(key, bucket, duration, filesize) {
    var dateObj = new Date;
    var dateExp = new Date(dateObj.getTime() + duration * 1000);
    var policy = {
      "expiration":dateExp.getUTCFullYear() + "-" + dateExp.getUTCMonth() + 1 + "-" + dateExp.getUTCDate() + "T" + dateExp.getUTCHours() + ":" + dateExp.getUTCMinutes() + ":" + dateExp.getUTCSeconds() + "Z",
      "conditions":[
        { "bucket":bucket },
        ["starts-with", "$key", ""],
        { "acl":"public-read" },
        ["starts-with", "$Content-Type", ""],
        ["content-length-range", 0, 10 * 1024 * 1024]
      ]
    };
    var policyString = JSON.stringify(policy);
    var policyBase64 = new Buffer(policyString).toString('base64');
    var signature = crypto.createHmac("sha1", this.secretKey).update(policyBase64);
    var accessKey = this.accessKey;
    var s3Credentials = {
      policy:policyBase64,
      signature:signature.digest("base64"),
      key:accessKey
    };
    return s3Credentials;
  };
}

module.exports = function(bucket_name){
	var myS3Account = new s3instance(process.env.AWS_ACCESS_KEY_ID,process.env.AWS_SECRET_ACCESS_KEY);
  var policy = myS3Account.writePolicy('uploads/', bucket_name, 60, 10);
  return policy;
}