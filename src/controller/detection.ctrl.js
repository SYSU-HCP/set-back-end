const debug = require('debug')('hcp-set:api-detection');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');
const clothesDetection = require('../services/clothesDetection');

async function analyzeDetectionResult(ctx, result) {
  if (result.err !== undefined && result.err === 0) {
    debug(result.msg);
    // debug(result);
    ctx.body = new IResponse(ctx, result.msg, result.data);
  } else {
    debug('可视化分析服务出错!!!')
    if (result.err !== undefined) {
      debug('远程服务的错误码：' + result.err);
    }
    if (result.errMsg !== undefined) {
      debug(`远程服务报错信息：${result.errMsg}`);
    }
    throw new ISoftError(result.errMsg, 503);
  }
}

/*
 * @require form-data{ img: one image}
 */
async function classification(ctx) {
  // debug(ctx.request.files)
  debug(`收到检测的请求：`)
  let theImage = null;
  if (ctx.request.files && ctx.request.files.img) {
    let uploadImages = ctx.request.files.img;
    if (uploadImages.length && uploadImages.length > 1) {
      console.log('warning: recieved ' + uploadImages.length + ' images, use the first one');
      debug('warning: recieved ' + uploadImages.length + ' images, use the first one');
      theImage = uploadImages[0];
    } else {
      theImage = uploadImages;
    }
  } else {
    throw new ISoftError('No images in form-data: img')
  }
  debug(`收到的图片文件名为：${theImage.name}`);

  var result = {};
  try {
    debug(`向图像检测服务传送数据并分析...`);
    result = await clothesDetection.classification(theImage);
  }
  catch (err) {
    debug(`图像检测服务出现未知错误`);
    debug(err);
    debug(result);
  }
  return analyzeDetectionResult(ctx, result);
}

module.exports = {
  classification
};
