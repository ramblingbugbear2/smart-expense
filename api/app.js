// require('dotenv').config();
// // console.log('[MONGO URI]', process.env.MONGODB_URI);
// const express = require('express');
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const authRoutes = require('./routes/auth.routes');
// const protect = require('./middleware/protect');

// const groupRoutes = require('./routes/group.routes');
// const expenseRoutes = require('./routes/expense.routes');

// const connectDB = require('./utils/mongodb');
// connectDB();
// require('./utils/redis')



// const app = express();
// app.use(express.json());

// const allowedOrigin = 'http://localhost:5173';

// app.use(
//   cors({
//     origin: allowedOrigin,   // ← exact origin, NOT *
//     credentials: true,       // ← allow cookies / auth header
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     allowedHeaders: 'Content-Type,Authorization',
//   })
// );

// // // (optional, but sometimes handy for older browsers)
// // app.options('*', cors({ origin: allowedOrigin, credentials: true }));


// app.use(cookieParser());
// app.use('/api/auth', authRoutes);

// app.use('/api/groups', groupRoutes);
// app.use('/api/expenses', expenseRoutes);

// app.use('/api/settlements', require('./routes/settlement.routes'));


// app.get('/hello' ,(req,res) => {
//     res.json({greeting : "SmartExpense is alive!", time: new Date().toISOString()});
// })

// app.get('/api/secure-hello',protect ,(req,res) => {
//     res.json({msg: `Hello user $(req.userId)!`});
// });

// const PORT = process.env.PORT || 3000;

// /* ------------- Socket.IO bootstrap ------------- */
// const socket = require('./utils/socket');          // util module you created
// // only start when running normally (not in Jest)
// let server;
// if (process.env.NODE_ENV !== 'test') {
//   server = app.listen(PORT, () =>
//     console.log(`🚀  Server on ${PORT}`)
//   );
// }

// const io = socket.init(server);                    // initialise once

// io.on('connection', sock => {                      // 'sock' not to shadow outer
//   console.log('⚡ client', sock.id);

//   sock.on('joinGroup', groupId => sock.join(groupId));

//   sock.on('disconnect',   ()   => console.log('✖', sock.id));
// });                                                // ← close handler block

// api/app.js
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes   = require('./routes/auth.routes');
const protect      = require('./middleware/protect');
const groupRoutes  = require('./routes/group.routes');
const expenseRoutes= require('./routes/expense.routes');
const settlementRoutes = require('./routes/settlement.routes');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  })
);

app.use('/api/auth',        authRoutes);
app.use('/api/groups',      groupRoutes);
app.use('/api/expenses',    expenseRoutes);
app.use('/api/settlements', settlementRoutes);

app.get('/hello',           (req, res) => res.json({ greeting: 'SmartExpense is alive!', time: new Date().toISOString() }));
app.get('/api/secure-hello',protect , (req, res) => res.json({ msg: `Hello user ${req.userId}!` }));

/* ---------- Runtime-only bootstrap (skip in tests) ---------- */
if (process.env.NODE_ENV !== 'test') {
  // MongoDB
  require('./utils/mongodb')();

  // Redis client (noop in tests)
  require('./utils/redis');

  // HTTP + Socket.IO
  const PORT   = process.env.PORT || 3000;
  const server = app.listen(PORT, () => console.log(`🚀  Server on ${PORT}`));

  const { init: initSocket } = require('./utils/socket');
  initSocket(server);
}

module.exports = app;   // tests import just the Express app
