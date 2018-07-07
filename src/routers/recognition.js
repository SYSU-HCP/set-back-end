const recognitionCtrl = require('../controller/recognition.ctrl');
const router = require('koa-router')()

router.prefix('/recognition')

router
<<<<<<< HEAD
  .post('/uploadImage', tagClassificationCtrl.uploadImage)
=======
  .post('/uploadImage', recognitionCtrl.uploadImage)
>>>>>>> c87f2d0cb5cca6c8fead3110a293851508885f13

module.exports = router.routes();
