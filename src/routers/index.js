const users = require('./users');
const mir = require('./mir')

const router = require('koa-router')({
  prefix: '/api',
});

router
  .use(users)
  .use(mir);
module.exports = router;
