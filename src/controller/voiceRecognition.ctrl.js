const debug = require('debug')('hcp-set:api-voiceRecognition');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');
const voiceRecognition = require('../services/voiceRecognition');

async function analyzeResult(ctx, result) {
  if (result.err !== undefined && result.err === 0) {
    debug(result.msg);
    // debug(result);
    ctx.body = new IResponse(ctx, result.msg, result.data);
  } else {
    debug('计算服务出错!!!')
    if (result.err !== undefined) {
      debug('远程服务的错误码：' + result.err);
    }
    if (result.errMsg !== undefined) {
      debug(`远程服务报错信息：${result.errMsg}`);
    }
    throw new ISoftError(result.errMsg, 503);
  }
}

// 接收id，将id上传到计算服务器上
async function uploadId(ctx) {
  let theId = ctx.request.body.id;
  debug(`第六组语音识别：收到上传id请求, id为${theId}`);
  if (!theId || theId === "") {
    throw new ISoftError('No id received');
  }

  var result = {};
  try {
    debug(`上传id并计算...`);
    result = await voiceRecognition.uploadIdToServer(theId);
  }
  catch (err) {
    debug(`可视化分析服务出现未知错误`);
    debug(err);
    debug(result);
  }
  return analyzeResult(ctx, result);
}

module.exports = {
  uploadId
}