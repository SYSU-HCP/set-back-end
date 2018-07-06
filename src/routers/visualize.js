const visualizeCtrl = require('../controller/visualize.ctrl');
const router = require('koa-router')()

router.prefix('/visualize')

router
  .post('/detection', visualizeCtrl.detection)
  .post('/urlDetection', visualizeCtrl.urlDetection)
  .post('/segment', visualizeCtrl.segment)

module.exports = router.routes();
