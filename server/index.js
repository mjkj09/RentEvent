const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const { swaggerDocs } = require('./config/swagger');

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/rentevent');

const venueRoutes = require('./routes/venue.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const reviewRoutes = require('./routes/review.routes');
const companyRoutes = require('./routes/company.routes');
const requestRoutes = require('./routes/request.routes');

app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/venues', venueRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/company', companyRoutes);

const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    swaggerDocs(app);
});