// api/utils/socket.js
 const { Server }   = require('socket.io');
 const EventEmitter = require('events');
 let io;

 /* ------------------- public helpers ------------------- */
 function init(server, opts) {
   io = new Server(server, opts);
   return io;
 }

 function get() {
   if (io) return io;              // real Socket.IO in runtime

   // ----------  dummy emitter for Jest  ----------
   const dummy = new EventEmitter();
   dummy.on   = () => {};
   dummy.off  = () => {};
   dummy.emit = () => {};
   dummy.to   = () => dummy;       // << allow io.to(room).emit(...)
   return dummy;
 }

 module.exports = { init, get };
