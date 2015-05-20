var AWS = require('aws-sdk'),
    s3 = new AWS.S3(),
    path = require('path');

module.exports = function(config, id, fileName, stream, callback) {
  var params = {ACL: "public-read", Bucket: config.bucket, Key: config.baseDir+"/"+id+path.extname(fileName), Body: stream};
  var options = {partSize: 10 * 1024 * 1024, queueSize: 2};

  s3.upload(params, options, callback);
};
