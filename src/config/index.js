const { NODE_ENV } = process.env;

/**
 * 服务端配置格式
 * @typedef {Object} Config
 * @property {{ host: string, port: number }} server
 * @property {{ port: number }} tester
 * @property {{ host: string, port: number, db: string }} mongo
 * @property {{ host: string, port: number }} redis
 * @property {{ host: string, port: number }} rabbitmq
 */

/**
 * @type {Config}
 */
const config = require(`./env/${NODE_ENV || 'test'}`);

module.exports = config;
