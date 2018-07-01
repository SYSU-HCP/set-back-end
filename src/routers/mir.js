const mirCtrl = require('../controller/mir.ctrl');
const router = require('koa-router')()
const koaBody = require('koa-body')

router.prefix('/mir')

router
  .post('/', mirCtrl.parseMIR)
  .post('/test', mirCtrl.uTest)

module.exports = router.routes();
