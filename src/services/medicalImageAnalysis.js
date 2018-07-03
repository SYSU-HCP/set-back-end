const axios = require('../utils/axios');
const FormData = require('form-data');
const debug = require('debug')('hcp-set:mir');
var fs = require('fs');
const baseURL = 'http://172.18.160.106:8080/api';
const testURL = 'http://localhost:8888/api';
const url = {
  mir: baseURL + '/mir',
  test: testURL + '/mir/test'
};
const multiConfig = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}
class medicalImageAnalysis {
  /**
   * @name getImageReport
   * @requires file image file object
   * @returns 2
   * statusCode : 200
   * data : { heatmapImageUrl:url, captions:string }
   * @description 获取取得医疗图像报告
    */
  // imageReport = (userImage) => axios.post(url.mir, {userImage});
  async imageReport(theImage) {
    debug(`医疗图像智能分析进行中。。。`)
    // debug(theImage.name);
    let fd = new FormData();
    fd.append('type', 'image')
    fd.append('file', fs.createReadStream(theImage.path), theImage.name);
    var data = {};
    try {
      var reportData = await axios.post(url.mir, fd, { headers: fd.getHeaders() });
      // var reportData = await axios.post( url.test, fd,{ headers: fd.getHeaders()})
      if (reportData.data.statusCode === 200) {
        debug(`分析顺利完成`);
        data = {
          err: 0,
          data: reportData.data.data
        };
      } else {
        // 有返回值，
        debug(`警告：分析失败`);
        debug(reportData.data);
        data.err = reportData.data.statusCode;
        data.errMsg = `分析失败：未定义的错误类型`;
      }
    }
    catch (err) {
      debug(`分析服务出错：`)
      debug(err);
      debug(err.uCode)
      debug(err.uMsg)
      if (err.uCode) {
        data.err = err.uCode;
        data.errMsg = err.uMsg;
      } else {
        debug('远程服务出现了意料之外的错误');
        // debug(err);
        data.err = 503;
        data.errMsg = '分析失败：远程服务出现了意料之外的错误';
      }
    }
    // debug(data);
    return data;
  }
}

module.exports = new medicalImageAnalysis();
