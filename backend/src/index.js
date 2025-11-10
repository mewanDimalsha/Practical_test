const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const dbConnect = require('./config/dbConnect');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

// Connect to the database
dbConnect();

const app = express();

// CORS middleware - MUST come before other middleware
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
// Mount product routes (protected by verifyToken inside the router)
app.use('/api/products', productRoutes);

//start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});