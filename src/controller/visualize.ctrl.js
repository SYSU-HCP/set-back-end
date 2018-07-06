const debug = require('debug')('hcp-set:api-visualize');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');
const modelVisualization = require('../services/modelVisualization');

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
async function detection(ctx) {
  // debug(ctx.request.files)
  debug(`收到网络可视化的请求：`)
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
    debug(`向可视化服务传送数据并分析...`);
    result = await modelVisualization.detection(theImage);
  }
  catch (err) {
    debug(`可视化分析服务出现未知错误`);
    debug(err);
    debug(result);
  }
  return analyzeDetectionResult(ctx, result);
}

/*
 * @request {imageUrl: 图片的url }
*/
async function urlDetection(ctx) {
  // debug(ctx.request);
  let { imageUrl } = ctx.request.body;
  debug(ctx.request.body);
  var theImage = null;
  if (imageUrl) {
    debug(`recieved image url is ${imageUrl}`);

  } else {
    throw new ISoftError('No imageUrl found');
  }

  var result = {};
  try {
    debug(`向可视化服务传送数据并分析...`);
    result = await modelVisualization.urlDetection(imageUrl);
  }
  catch (err) {
    debug(`可视化分析服务出现未知错误`);
    debug(err);
    debug(result);
  }
  return analyzeDetectionResult(ctx, result);
}

/*
 * @require form-data{
 *  img: the image,
 *  layer: string,
 *  unit: string
 * }
 */
async function segment(ctx) {
  // debug(ctx.request.files)
  debug(`收到网络可视化的请求：`)
  let theImage = null;
  let theLayer = "";
  let theUnit = "";
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
  if (ctx.request.body.layer && ctx.request.body.layer != "") {
    theLayer = ctx.request.body.layer;
  } else {
    throw new ISoftError('No layer information in form-data: layer')
  }
  if (ctx.request.body.unit && ctx.request.body.unit != "") {
    theUnit = ctx.request.body.unit;
  } else {
    throw new ISoftError('No unit info in form-data: unit')
  }
  debug(`收到的图片文件名为：${theImage.name}\n 网路层为${theLayer} 单元为${theUnit}`);

  let result = {};
  try {
    debug(`向可视化服务传送数据并分析...`);
    result = await modelVisualization.segment({ img: theImage, layer: theLayer, unit: theUnit });
  }
  catch (err) {
    debug(`可视化分析服务出现未知错误`);
    debug(err);
    debug(result);
  }
  return analyzeDetectionResult(ctx, result);
}

module.exports = {
  detection,
  urlDetection,
  segment
};
