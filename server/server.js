const express = require('express');
const app = express();
require('dotenv').config();

// Middleware configurations: Cors, Logger,
const corsOptions =  require('./configs/cors');
const cors = require('cors');
const { logger } = require('./middlewares/logger');
const errHandler = require('./middlewares/errHandler');

// Form data urlencodede parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cors & logger set up 
app.use(cors(corsOptions));
app.use(logger)




app.use(errHandler)
app.listen(process.env.STAGING_PORT,() => {
    console.log("Server is app and running");
})