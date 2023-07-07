const whiteList = ['http://localhost:6000', 'http://localhost:5173'];

const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) != -1 || !origin) return callback(null,true);
        callback( new Error ("Not allowed by cors"));
    },
    optionSuccessStatus: 200,
    credentials: true
}

module.exports = corsOptions