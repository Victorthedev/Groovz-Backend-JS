const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // Import session
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Set up session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'd27d1db47485ae686d191db00585d3eef9fab53166a90c1d0768d4c4b05f02ff', // use a secure secret
    resave: false,
    saveUninitialized: true,
}));

app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});