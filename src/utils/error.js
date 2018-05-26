/**
 * @class
 * @classdesc 软错误类型，可以被服务端处理并响应给前端的错误(基本就是 4xx)
 */
class ISoftError extends Error {
  /**
   * @constructor
   * @param {string} message
   * @param {number} status
   */
  constructor(message, status) {
    super(message);
    this.status = status || 400;
  }
}

module.exports = ISoftError;
