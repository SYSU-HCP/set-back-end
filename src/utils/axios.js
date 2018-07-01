const axios = require('axios');
const debug = require('debug')('hcp-set:axios:');

// 请求超时时间，为了防止后端反应过慢，设置为30秒
axios.defaults.timeout = 30000;
// 重新尝试次数 4
axios.defaults.retry = 4;
// 重新尝试间隔 3秒
axios.defaults.retryDelay = 3000;

// 因为各个服务的url不一样
// 所以请在调用前指明config.url字段
// axios.defaults.baseURL = 'http//xxx.xxx.xxx.xx/api';


// 请注意，错误返回都会触发Promise.reject
// 根据uCode和uMsg来获得简要错误信息
axios.interceptors.response.use(
  res => res,
  err => {
    const { response, code } = err;
    if (code && code === 'ECONNABORTED') {
      // 处理链接断开或超时重新请求的问题
      let { config } = err;
      if (config && config.retry) {
        config._retry = config._retry || 0;
        if (config._retry < config.retry) {
          config._retry++;

          const backOff = new Promise(resolve => {
            setTimeout(() => resolve(), config.retryDelay || 100);
          });
          config = { ...config, url: config.url.slice(4) };
          return backOff.then(() => axios(config));
        } else {
          if (process.env.NODE_ENV !== 'production') {
            debug('网络请求超时');
            err.uCode = 408;
            err.uMsg = '网络请求超时';
          }
          // {type: 'warning', message: '网络请求超时'});
        }
      }
    }

    if (response) {
      // 先在控制台输出错误
      var printDebug = false;
      if (process.env.NODE_ENV !== 'production') {
        debug('errResponse');
        // debug(response);
        // debug(response);
        printDebug = true;
      }
      const message = response.data && response.data.msg;
      // 根据状态码做响应的操作
      switch (response.status) {
        // 400是发送的数据有误，直接将错误alert出来
        case 400:
          if (printDebug) {
            debug(message);
          }
          err.uCode = 400;
          err.uMsg = message;
          break;
        // 401是未授权，需要引导用户重新登录
        case 401:
          if (printDebug) {
            debug(message);
          }
          err.uCode = 401;
          err.uMsg = message;
          break;
        // 403是无权限，同401处理,不过应该先退出登录
        case 403:
          if (printDebug) {
            debug(message);
          }
          err.uCode = 403;
          err.uMsg = message;
          break;
        // 500是服务器内部错误，开发模式alert出来，方便调试，生产模式就忽略掉吧
        case 500:
          if (printDebug) {
            debug('server error');
            // debug(message);
            // debug(typeof (err))
            debug(err)
          }
          // 503 代表远端服务炸掉了
          err.uCode = 503;
          if (message) {
            err.uMsg = message;
          } else {
            err.uMsg = "remote server occured an error"
          }
          break;
      }
    }
    return Promise.reject(err);
  }
);

module.exports = axios;
