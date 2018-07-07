const users = require('./users');
const mir = require('./mir');
const visualize = require('./visualize');
const detection = require('./detection');
const recognition = require('./recognition');
const voiceRecognition = require('./voiceRecognition')

const router = require('koa-router')({
  prefix: '/api',
});

router
  .use(users)
  .use(mir)
  .use(visualize)
  .use(detection)
  .use(recognition)
  .use(voiceRecognition);
module.exports = router;
