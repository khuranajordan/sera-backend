const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const Razorpay = require('razorpay');
const config = require('./config/config');
const morgan = require('./config/morgan');
const {jwtStrategy} = require('./config/passport');
const {authLimiter} = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const {errorConverter, errorHandler} = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({extended: true}));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

app.get('/test', (req, res) => {
  res.send('Test Success');
});

app.post('/sera/payment', async (req, res) => {
  try {
    const {amount} = req.body;
    const instance = new Razorpay({
      key_id: 'rzp_test_XYwqCpEMLN449E',
      key_secret: 'OWLVzaBFEImYojFKUATgrsdZ',
    });

    const order = instance.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: 'receipt#1',
    });

    res.status(201).json({
      success: 'true',
      order,
      amount,
    });
  } catch (error) {
    // Handle any errors
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({error: 'Failed to create payment order'});
  }
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
