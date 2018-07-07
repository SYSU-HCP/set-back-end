const tagClassificationCtrl = require('../controller/recognition.ctrl');
const router = require('koa-router')()

router.prefix('/recognition')

router
  .post('/uploadImage', tagClassificationCtrl.uploadImage)

module.exports = router.routes();
