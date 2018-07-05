const tagClassificationCtrl = require('../controller/recognition.ctrl');
const router = require('koa-router')()

router.prefix('/recognition')

router
  .post('/uploadImage', recognition.uploadImage)

module.exports = router.routes();
