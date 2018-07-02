const users = require('./users');
const mir = require('./mir');
const visualize = require('./visualize');

const router = require('koa-router')({
  prefix: '/api',
});

router
  .use(users)
  .use(mir)
  .use(visualize);
module.exports = router;
