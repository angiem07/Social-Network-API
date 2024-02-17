const express = require('express');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
const routes = require('./routes');
app.use(routes);

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/social-network-api';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1); // Exit the process if unable to connect to the database
});

// Set mongoose debugging
if (process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
