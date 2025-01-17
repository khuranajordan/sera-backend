const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const apiRoute = require('./apiroute');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/api',
    route: apiRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach(route => {
  router.use(route.path, route.route);
});


if (config.env === 'development') {
  devRoutes.forEach(route => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
