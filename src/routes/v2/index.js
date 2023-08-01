const express = require('express');
const testRoute = require('./authenticate.route.js')
const config = require('../../config/config');
const docsRoute = require('./docs.route');
const router = express.Router();

const defaultRoutes = [
    {
        path: '/api',
        route: testRoute,
      },
];

const devRoutes = [
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
