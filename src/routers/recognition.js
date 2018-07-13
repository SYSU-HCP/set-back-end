const recognitionCtrl = require('../controller/recognition.ctrl');
const router = require('koa-router')()

router.prefix('/recognition')

router
  .post('/uploadImage', recognitionCtrl.uploadImage)
  // .post('/uploadImageUrl', recognitionCtrl.uploadImageUrl)

module.exports = router.routes();
