const voiceRecognitionCtrl = require('../controller/voiceRecognition.ctrl');
const router = require('koa-router')()

router.prefix('/voiceRecognition')

router
  .post('/uploadId', voiceRecognitionCtrl.uploadId)

module.exports = router.routes();
