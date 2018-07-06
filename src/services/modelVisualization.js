const axios = require('../utils/axios');
const FormData = require('form-data');
const debug = require('debug')('hcp-set:modelVisualization');
var fs = require('fs');
const baseURL = 'http://222.200.180.105:7070/api';
const segmentURL = 'http://222.200.180.105:8085/api';
const testURL = 'http://localhost:8888/api';

const url = {
  detection: baseURL + '/detection',
  urlDetection: baseURL + '/detectionurl',
  segment: segmentURL +'/segment',
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
    } else if(imgType) {
      reportData = await axios.post(url, data);
    }
    // var reportData = await axios.post( url.test, fd,{ headers: fd.getHeaders()})
    if (reportData.data.rtn === 200) {
      debug(`分析顺利完成`);
      debug(reportData.data.msg);
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

class modelVisualization {
  /**
   * @name getImageReport
   * @requires file image file object
   * @returns 2
   * statusCode : 200
   * data : { heatmapImageUrl:url, captions:string }
   * @description 获取取得医疗图像报告
    */
  // imageReport = (userImage) => axios.post(url.mir, {userImage});
  async detection(theImage) {
    debug(`可视化分析进行中。。。`)
    // debug(theImage.name);
    let fd = new FormData();
    fd.append('type', 'image')
    fd.append('img', fs.createReadStream(theImage.path), theImage.name);
    return await detectionServer(2, fd, url.detection);
  }

  async urlDetection(imageUrl) {
    debug(`可视化分析进行中。。。`)
    // debug(theImage.name);
    let postData = {
      imgurl: imageUrl
    }
    return await detectionServer(1, postData, url.urlDetection);
  }

  async segment(data) {
    debug(`区域分析进行中。。。`)
    // debug(theImage.name);
    let fd = new FormData();
    fd.append('type', 'image');
    fd.append('img', fs.createReadStream(data.img.path), data.img.name);
    fd.append('type', 'string');
    fd.append('layer',data.layer);
    fd.append('type', 'string');
    fd.append('unit',data.unit);
    return await detectionServer(2, fd, url.segment);
  }

}

module.exports = new modelVisualization();
