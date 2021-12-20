require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbconnection } = require('./database/database.conection');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

// the limit of requests that a user can make in x time
const limiter = rateLimit({
    max: 600,
    windowMs: 60 * 60 * 1000,
    message: 'you have exceeded the limit of requests per hour'
});

// the urls that can make requests to this server
const linkList = ['http://localhost:4200'];

// start the app with express
const app = express();

// middlewares
app.use(cors({ origin: linkList }));
app.use(mongoSanitize());
app.use('/api', limiter);

// lecture and parseo
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// db connection
dbconnection();

// routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/file', require('./routes/file.routes'));
app.use('/api/folder', require('./routes/folder.routes'));
app.use('/api/search', require('./routes/search.routes'));

// start the server
app.listen(3000, () => {
    console.log('escuchando puerto 3000'); 
})