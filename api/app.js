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
app.use('/api/members', require('./routes/member.route'));   // before error handler


// app.get('/hello',           (req, res) => res.json({ greeting: 'SmartExpense is alive!', time: new Date().toISOString() }));

//health check unified as railway will also use this for health check
app.get('/api/health', (req, res) => res.json({ 
  status: 'OK', 
  timestamp: new Date().toISOString(),
  service: 'Smart Expense API',
  database: 'connected' // Railway can use this for health checks
}));
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
