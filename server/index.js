const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.log(err));

const venueRoutes  = require('./routes/venue.routes');
const authRoutes   = require('./routes/auth.routes');
const userRoutes   = require('./routes/user.routes');
const reviewRoutes = require('./routes/review.routes');

app.use('/api/venues', venueRoutes);
app.use('/api/auth',   authRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/reviews',reviewRoutes);

const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
