const express = require('express');

// Import routes
const authRoutes = require('./src/routes/auth.routes')
const appartmentRoutes = require('./src/routes/appartments.routes');

const app = express();
const port = process.env.port || 3000;

app.use(express.json());

// Using routes
app.use('/api/', authRoutes);
app.use('/api/appartments', appartmentRoutes);

// Handle all other (not found) endpoints.
app.all('*', (req, res, next) => {
    console.log('Endpoint not found.')

    const errorObject = {
      message: 'Endpoint does not exist!',
      code: 404,
      date: new Date()
    }
    next(errorObject);
});

// Error handler
app.use((error, req, res, next) => {
    console.log(error.message.toString());
    res.status(error.code).json(error)
  })

app.listen(port, ()=> console.log("listening on port "+port));

module.exports = app;