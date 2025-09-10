const express = require('express');
const app = express();
require('dotenv').config();

// just requiring will run the mongoose.connect() inside db.js
require('./db');  

const userrouter = require('./routes/userauth');
const adminrouter = require('./routes/admin');
const previewrouter = require('./routes/preview');

app.use(express.json());
app.use('/api/user', userrouter);
app.use('/api/admin', adminrouter);
app.use('/api/preview', previewrouter);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        message: 'Server is healthy'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
