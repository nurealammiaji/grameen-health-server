const allowedOrigins = ['http://localhost:5173', 'https://grameen.com.bd'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET, HEAD, PUT, PATCH, POST, DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

module.exports = corsOptions;