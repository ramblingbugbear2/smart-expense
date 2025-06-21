require('dotenv').config();
console.log('[MONGO URI]', process.env.MONGODB_URI);
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const protect = require('./middleware/protect');

const groupRoutes = require('./routes/group.routes');
const expenseRoutes = require('./routes/expense.routes');

const connectDB = require('./utlis/mongodb');
require('./utlis/redis')

connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);


app.get('/hello' ,(req,res) => {
    res.json({greeting : "SmartExpense is alive!", time: new Date().toISOString()});
})

app.get('/api/secure-hello',protect ,(req,res) => {
    res.json({msg: `Hello user $(req.userId)!`});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
});