const tagClassificationCtrl = require('../controller/tagClassification.ctrl');
const router = require('koa-router')()

router.prefix('/tagCalssification')

router
  .post('/uploadImage', tagClassificationCtrl.uploadImage)

module.exports = router.routes();
