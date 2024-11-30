const cors = require('cors');

const corsOptions = {
  origin: ['http://localhost:5173', 'https://main.d1n7z7zw3v28b1.amplifyapp.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);