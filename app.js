const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const playlistRoutes = require('./routes/playlistRoutes');

dotenv.config();

const app = express();
app.use(cors()); 
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/playlist', playlistRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
