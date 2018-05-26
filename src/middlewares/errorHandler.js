const Context = require('koa/lib/context');
const { IErrorResponse } = require('../utils/response');
// const errDebug = require('debug')('hcp-set:ERROR:errorHandler');
/**
 * 错误处理中间件
 * @param {Context} ctx
 * @param {() => Promise<void>} next
 */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    // errDebug(e);
    const msg = e ? e.message : null;
    // const stack = e ? e.stack : null;
    ctx.body = new IErrorResponse(ctx, msg, e);
  }
};
