const fs = require('fs');
const fsPromises = require('fs').promises
const { format } = require('date-fns');
const { randomUUID } = require('crypto');
const path = require('path');

const logEvents = async(message,file) => {
    const dateTime  = `${format(new Date(), 'yyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t ${randomUUID()}\t${message}\n`

    try{
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs',  file), logItem);
    }
    catch(err){
       console.error(err)
    }

}

const logger = (req,res,next) => {
    logger(`${req.method}\t${req.headers.origin}\t${req.url}`, 'req.txt');
    next()
}

module.exports = {logger, logEvents}