var config = require('../../config/config');

module.exports = new function() {
  this.files = {};

  this.addFile = function(io, id, chunks) {
    var self = this;
    if (!chunks) {
      chunks = [];
    }
    var nsp = io.of('/'+id);
    nsp.on('connection', function (socket) {
      console.log("connection on socket io", id);
      socket.emit('file', {
        error: self.files[id].error,
        status: self.files[id].status,
        chunks:self.files[id].chunks
      });
    });

    this.files[id] = {
      id: id,
      chunks: chunks,
      nsp: nsp,
      status: 'pending',
      error: false
    };
  };

  this.updateChunks = function(io, id, nbr_chunks, error) {
    if (!this.files[id]) {
      console.log("file "+ id +" doesn't exist in files:", this.files);
      return;
    }
    if (error)
      this.files[id].status = 'error';
    this.files[id].error = error;
    this.files[id].chunks = [];
    for (var i = 0; i < nbr_chunks; i++) {
      this.files[id].chunks.push({
        n: i,
        done: false,
        error: false,
      });
    }
    console.log("sending chunks", this.files[id].chunks);
    this.files[id].nsp.emit('chunks', this.files[id].chunks);
  };

  this.updateChunk = function(io, id, chunk, done, error) {
    if (!this.files[id]) {
      console.log("file "+ id +" doesn't exist in files:", this.files);
      return;
    }
    if (error) {
      this.files[id].status = 'error';
      this.files[id].error = error;
    }
    this.files[id].chunks[chunk] = {
      n: chunk,
      done: done,
      error: error,
    };
    console.log("sending chunk", this.files[id].chunks[chunk]);
    this.files[id].nsp.emit('chunk', this.files[id].chunks[chunk]);
  };

  this.checkIntegrity = function(amqp, id) {
    if (!this.files[id]) {
      console.log("file "+ id +" doesn't exist in files:", this.files);
    }
    var chunks = this.files[id].chunks;
    var err = false;
    for (var i in chunks) {
      if (chunks[i].done == false && chunks[i].error == null && err == false) {
        this.files[id].status = 'pending';
        return;
      }
      if (chunks[i].error) {
        this.files[id].status = 'error';
        this.files[id].error = chunks[i].error;
        err = true;
      }
    }
    if (err == false) {
      this.files[id].status = 'merging';
      amqp.publish(config.amqp.worker_queue, {
        action: 'merge',
        id: id,
        chunks: this.files[id].chunks.length,
        source: config.upload.uploader
      }, {}, function(confirm) {
        console.log("Received answer from merge", confirm);
      });
      this.files[id].nsp.emit('merging', {});
    }
  };

  this.done = function(io, id, error) {
    this.files[id].error = error;
    this.files[id].status = 'done';
    if (error)
      this.files[id].status = 'error';
    this.files[id].nsp.emit('done', { error: err});
  };
};
