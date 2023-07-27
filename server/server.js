const express = require('express');
const app = express();
require('dotenv').config();

// Middleware configurations: Cors, Logger,
const corsOptions =  require('./configs/cors');
const cors = require('cors');
const { logger } = require('./middlewares/logger');
const errHandler = require('./middlewares/errHandler');
const cookieParser = require('cookie-parser');
const compoundInterestController = require('./controllers/CompoundInterest');


// Form data urlencodede parsing
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: false }));

// Cors & logger set up 
app.use(cors(corsOptions));
// app.use(logger)

try{
   async function compoundInterest(){
     await compoundInterestController()
   }
   setInterval(() => compoundInterest(), 3000);
}catch(err){
    console.error(err)
}
// Routes

// Admin Routes
app.use('/admin/home', require('./routes/admin/index'));
app.use('/admin/register', require('./routes/admin/register'));
app.use('/admin/login', require('./routes/admin/login'));
app.use('/admin/api/users', require('./routes/admin/api/users'));
app.use('/admin/api/genDeposits', require('./routes/admin/api/generalDeposits'));
app.use('/admin/api/savDeposits', require('./routes/admin/api/savingsDeposits'));
app.use('/admin/api/genWithdraws', require('./routes/admin/api/generalWithdraws'));
app.use('/admin/api/savWithdraws', require('./routes/admin/api/savingsWithdrawals'));


// User Routes
app.use('/user/register', require('./routes/users/register'));
app.use('/user/login', require('./routes/users/login'));
app.use('/user/api/genAcc',require('./routes/users/api/generalAcc'));
app.use('/user/api/savAcc', require('./routes/users/api/savingsAcc'));


app.use(errHandler)
app.listen(process.env.STAGING_PORT,() => {
    console.log("Server is app and running");
})