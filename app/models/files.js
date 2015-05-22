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

  this.updateChunks = function(io, id, nbr_chunks) {
    if (!this.files[id]) {
      return;
    }
    this.files[id].chunks = [];
    for (var i = 0; i < nbr_chunks; i++) {
      this.files[id].chunks.push({
        n: i,
        done: false,
        error: null,
      });
    }
    this.files[id].nsp.emit('chunks', this.files[id].chunks);
  };
};
