module.exports = new function() {
  this.files = {};

  this.addFile = function(io, id, chunks) {
    var self = this;
    if (!chunks) {
      chunks = [];
    }
    var nsp = io.of('/'+id);
    nsp.on('connection', function (socket) {
      socket.emit('chunks', self.files[id].chunks);
    });

    this.files[id] = {
      id: id,
      chunks: chunks,
      nsp: nsp
    };
  };
};
