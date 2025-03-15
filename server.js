// Load environment variables from .env file (only for local development)
require('dotenv').config();

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');

// Import custom middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// Import controllers (handling authentication and applications)
const authController = require('./controllers/auth.js');
const applicationsController = require('./controllers/applications.js');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000; // Use the Heroku-assigned port or default to 5000

// Ensure MONGODB_URI is set before connecting
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is missing! Set it in Heroku using:');
  console.error('heroku config:set MONGODB_URI=your_connection_string --app skyrockit-app');
  process.exit(1); // Stop the app if no database URL is provided
}

// Connect to MongoDB with error handling
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log(`✅ Connected to MongoDB: ${mongoose.connection.name}`))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Stop the app if the database connection fails
  });

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Serve static files (CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up user session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret', // Use a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to pass user data to views (if logged in)
app.use(passUserToView);

// Routing setup

// Home Route: Redirect to user applications if signed in, otherwise show homepage
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    res.render('index.ejs');
  }
});

// Authentication Routes (Login, Register, Logout)
app.use('/auth', authController);

// Protected Routes (Require User to be Signed In)
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationsController);

// Start Express server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}!`);
});
