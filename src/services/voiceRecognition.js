var fs = require('fs');
const debug = require('debug')('hcp-set:voiceRecognition');
const axios = require('../utils/axios');

const url = 'http://222.200.180.105:36541/api/async_api';

class voiceRecognition {
  // @param id the id to upload to server
  async uploadIdToServer(id) {
    var reqUrl = url + '?id=id_' + id;
    debug(`调用语音识别服务：${reqUrl}`);
    var returnData = {};
    try {
      var reportData = await axios.get(reqUrl);
      debug(`reportDate:${reportData}`)
      debug(`语音识别顺利完成,返回结果: ${reportData.words}`);
      returnData = {
        err: 0,
        msg: "",
        data: reportData.words
      }
    } catch (err) {
      debug(`语音识别服务出错：`)
      debug(err);
      debug(err.uCode)
      debug(err.uMsg)
      if (err.uCode) {
        returnData.err = err.uCode;
        returnData.errMsg = err.uMsg;
      } else {
        debug('远程服务出现了意料之外的错误');
        // debug(err);
        returnData.err = 503;
        returnData.errMsg = `语音识别失败：远程服务出现了意料之外的错误\n${err}`;
      }
    }

    return returnData;
  }
}

module.exports = new voiceRecognition();