require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/hello' ,(req,res) => {
    res.json({greeting : "SmartExpense is alive!", time: new Date().toISOString()});
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
});