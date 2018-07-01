/* eslint-disable no-unused-vars */
const ISoftError = require('./error');
const Context = require('koa/lib/context');
const env = process.env.NODE_ENV;
const debug = require('debug')('hcp-set:errorHandler:');

/**
 * @classdesc 正常响应类
 */
class IResponse {
  /**
   * @constructor
   * @param {Context} ctx
   * @param {string} msg
   * @param {data} data
   * @param {number} status
   */
  constructor(ctx, msg, data, status) {
    this.msg = msg || '';
    this.data = data || null;
    ctx.status = status || 200;
  }
}

/**
 * @classdesc 错误响应类
 */
class IErrorResponse extends IResponse {
    /**
     * @constructor
     * @param {Context} ctx
     * @param {string} msg
     * @param {Error | ISoftError} err
     * @param {number} status
     */
  constructor(ctx, msg, err, status) {
    super(ctx, msg, null, status);
    // 如果是可以处理的错误，检查是否有 status，没有就 400
    debug(msg)
    debug(err);
    if (err instanceof ISoftError) {
      ctx.status = status || err.status;
    } else ctx.status = status || 500; // 否则检查是否有 status, 没有就 500
    // 生产环境不输出错误
    // TODO:测试环境能否正常将 error 输出给前端
    this.error = env === 'production' ? null : err.stack || null;
  }
}

module.exports = {
  IResponse,
  IErrorResponse,
};
