const axios = require('../utils/axios');
const FormData = require('form-data');
const debug = require('debug')('hcp-set:clothesDetection');
var fs = require('fs');
const baseURL = 'http://172.18.160.97:8000/api';
const baseIP = 'http://172.18.160.97:8000'
const testURL = 'http://localhost:8888/api';

const url = {
  classification: baseURL + '/cloth_search',
  xxxxx: baseURL + '/xxxx'
};

// imgType用来区别传入类型
// 1 代表url
// 2 代表form-data
async function detectionServer(imgType, data, url) {
  // 远程服务返回数据
  var reportData = {};
  // 本函数返回数据
  var returnData = {};
  // debug(url);
  // debug(data);
  try {
    if (imgType === 2) {
      reportData = await axios.post(url, data, { headers: data.getHeaders() });
    } else if (imgType) {
      reportData = await axios.post(url, data);
    }
    // var reportData = await axios.post( url.test, fd,{ headers: fd.getHeaders()})
    if (reportData.data.rtn === 200||reportData.data.rtn===404) {
      debug(`分析顺利完成`);
      debug(reportData.data.msg);
      for (var i in reportData.data.data.images) {
        // 加上http头
        reportData.data.data.images[i] = baseIP + reportData.data.data.images[i]
        // console.log(reportData.data.data.images[i])
      }
      returnData = {
        err: 0,
        msg: reportData.data.msg,
        data: reportData.data.data
      };
    } else {
      // 有返回值，
      debug(`警告：分析失败`);
      debug(reportData.data);
      returnData.err = reportData.data.rtn;
      returnData.errMsg = `分析失败：未定义的错误类型\n`;
      if (reportData.data.msg) {
        debug(reportData.data.msg);
        returnData.errMsg += reportData.data.msg;
      }
    }
  }
  catch (err) {
    debug(`分析服务出错：`)
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
      returnData.errMsg = `分析失败：远程服务出现了意料之外的错误\n${err}`;
    }
  }
  // debug(returnData);
  return returnData;
}

class clothesDetection {
  /**
   * @name getImageReport
   * @requires file image file object
   * @returns 2
   * statusCode : 200
   * data : { heatmapImageUrl:url, captions:string }
   * @description 获取取得医疗图像报告
    */
  // imageReport = (userImage) => axios.post(url.mir, {userImage});
  async classification(theImage) {
    debug(`分类进行中。。。`)
    // debug(theImage.name);
    let fd = new FormData();
    try {
      fd.append('type', 'image')
      fd.append('img', fs.createReadStream(theImage.path), theImage.name);
      return await detectionServer(2, fd, url.classification);
    }
    catch (err) {
      debug(err);
      throw (err);
    }
  }
}

module.exports = new clothesDetection();
