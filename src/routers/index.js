const users = require('./users');

const router = require('koa-router')({
  prefix: '/api',
});

router
  .use(users);

module.exports = router;
