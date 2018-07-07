const recognitionCtrl = require('../controller/recognition.ctrl');
const router = require('koa-router')()

router.prefix('/recognition')

router
  .post('/uploadImage', recognitionCtrl.uploadImage)

module.exports = router.routes();
