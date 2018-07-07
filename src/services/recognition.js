var fs = require('fs');
const FormData = require('form-data');
const debug = require('debug')('hcp-set:recognition');
const axios = require('../utils/axios');

const url = 'http://172.18.160.97:8080/api/recognition';

class recognition {
  // @param img the image to upload to server
  // @return true or false
  async uploadImgToServer(img) {
    debug(`上传图片：POST -> ${url}`);
    let fd = new FormData();
    fd.append('type', 'image');
    fd.append('img', fs.createReadStream(img.path), img.name);
    var returnData = {};
    try {
      var reportData = await axios.post(url, fd, { headers: fd.getHeaders() });
      if (reportData.data.rtn === 200) {
        debug(`计算顺利完成`);
        debug(reportData.data.msg);
        returnData = {
          err: 0,
          msg: reportData.data.msg,
          data: reportData.data.data
        }
      } else {
        debug(`警告：计算失败`);
        debug(reportData.data);
        returnData.err = reportData.data.rtn;
        returnData.errMsg = `计算失败：未定义的错误类型\n`;
        if (reportData.data.msg) {
          debug(reportData.data.msg);
          returnData.errMsg += reportData.data.msg;
        }
      }
    } catch (err) {
      debug(`计算服务出错：`)
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
        returnData.errMsg = `计算失败：远程服务出现了意料之外的错误\n${err}`;
      }
    }

    return returnData;
  }
}

module.exports = new recognition();