var fs = require('fs');
const debug = require('debug')('hcp-set:voiceRecognition');
const axios = require('../utils/axios');

const url = 'http://222.200.180.105:8080/api/voiceRecognition';

class voiceRecognition {
  // @param id the id to upload to server
  uploadIdToServer(id) {
    debug(`上传id ${id} ：POST -> ${url}`);
    var returnData = {};
    try {
      var reportData = await axios.post(url, id);
      if (reportData.data.rtn === 200) {
        debug(`语音识别顺利完成`);
        debug(reportData.data.msg);
        returnData = {
          err: 0,
          msg: reportData.data.msg,
          data: reportData.data.data
        }
      } else {
        debug(`警告：语音识别失败`);
        debug(reportData.data);
        returnData.err = reportData.data.rtn;
        returnData.errMsg = `语音识别失败：未定义的错误类型\n`;
        if (reportData.data.msg) {
          debug(reportData.data.msg);
          returnData.errMsg += reportData.data.msg;
        }
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