const allowedOrigins = [
    'http://localhost:5173', // Local development
    'https://grameen.com.bd'   // Production
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    exposedHeaders: ['Authorization'], // Expose any additional headers
    credentials: true, // Allow credentials (cookies, authorization headers)
    optionsSuccessStatus: 204 // For legacy browser support
};

module.exports = corsOptions;