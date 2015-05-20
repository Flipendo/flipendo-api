var config = require('../../config/config'),
    uploaders = require('../models/uploaders'),
    uuid = require('node-uuid'),
    busboy = require('connect-busboy'),
    fs = require('fs'),
    io = require('../io')();

exports.index = function(req, res){
  res.send({status: 200, result: 'OK'})
};

exports.upload = function(req, res){
  var id = uuid.v1();
  console.log(req.files.file);
  var rstream = fs.createReadStream(req.files.file.path);
  uploaders[config.upload.uploader](config.upload, id, req.files.file.name, rstream, function(err, data) {
    if (err) {
      res.send({status: err.statusCode, error: "Could not upload file to server", code: err.code}, err.statusCode);
      return
    }
    res.send({status: 200, id: id});
  });
};

exports.progress = function(req, res) {
  io.sockets.on('connection', function (socket) {
    var room = req.params.id;

    var roomKeys = Object.keys(io.sockets.manager.roomClients[socket.id]);
    roomKeys.forEach(function(key) {
        if (key === '' || key === '/' + room) return;
        socket.leave(key.slice(1));
    });

    socket.join(room);
});
}
