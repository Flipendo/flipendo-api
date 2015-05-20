var socketio = function (io) {
  if (!io) return socketio._io;
  socketio._io = io;
}

module.exports = socketio;
