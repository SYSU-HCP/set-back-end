const mirCtrl = require('../controller/mir.ctrl');
const router = require('koa-router')()

router.prefix('/mir')

router
  .post('/', mirCtrl.parseMIR)

module.exports = router.routes();
