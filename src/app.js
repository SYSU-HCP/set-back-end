const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const session = require('koa-session');
const errorHandler = require('./middlewares/errorHandler');
const debug = require('debug')('hcp-set:init');
// config
const config = require('./config');
// setting
app.name = 'hcp-set-dl server';
app.env = 'development';

// todo
// db
//const db = require('./models/db');
// mongoose
//const mongoose = require('mongoose');
// init database
//db();

// error handler
app.use(errorHandler);

// development style logger
app.use(logger());

// middlewares
app.use(koaBody())
app.use(json())

app.use(require('koa-static')(__dirname + '/../public'))

app.keys = ['hcp-set-dl-server'];
const sessionMid = session({
  key: 'hcp-set-dl-server', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 1 * 60 * 60 * 1000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false,
}, app);

app.use(sessionMid);

// router
const router = require('./routers');
app.use(router.routes());

// start http server
try {
  app.listen(config.server.port);
}
catch (err) {
  debug(err);
  throw (err);
}
console.log('Start listening on ' + config.server.port);
debug('Listening on ' + config.server.port)

// graceful restart or stop process
process.on('SIGINT', () => {
  // some work before the process stop
  console.log('Process is ready to close!');
  // close the database connect and save
  mongoose.connection.close(() => {
    console.log('Mongoose connection with DB is disconnected through app termination');
    // process exit
    process.exit(0);
  });
  // todo 清除redis 做一些其他的收尾工作
});
