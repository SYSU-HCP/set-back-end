const detectionCtrl = require('../controller/detection.ctrl');
const router = require('koa-router')()

router.prefix('/detection')

router
  .post('/classification', detectionCtrl.classification)


module.exports = router.routes();
