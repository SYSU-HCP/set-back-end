const debug = require('debug')('hcp-set:api-mir');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');
const medicalImageReport = require('../services/medicalImageAnalysis');

async function parseMIR(ctx) {
  // debug(ctx.request.files)
  debug(`收到MIR医疗图像分析的请求：`)
  let theImage = null;
  if (ctx.request.files && ctx.request.files.file) {
    let uploadImages = ctx.request.files.file;
    if (uploadImages.length && uploadImages.length > 1) {
      console.log('warning: recieved ' + uploadImages.length + ' images, use the first one');
      debug('warning: recieved ' + uploadImages.length + ' images, use the first one');
      theImage = uploadImages[0];
    } else {
      theImage = uploadImages;
    }
  } else {
    throw new ISoftError('No images in form-data: file')
  }
  debug(`收到的图片文件名为：${theImage.name}`);

  var result = {};
  try {
    debug(`向智能医疗后台传送数据并请求分析...`)
    result = await medicalImageReport.imageReport(theImage);
  }
  catch (err) {
    debug(`智能医疗服务出现未知错误`)
    debug(err);
    debug(result);
  }
 
  if (result.err !== undefined && result.err === 0) {
    debug('MIR医疗图像分析成功！')
    // debug(result);
    ctx.body = new IResponse(ctx, 'MIR医疗图像分析成功', result.data);
  } else {
    debug('MIR服务出错!!!')
    if (result.err !== undefined) {
      debug('远程服务的错误码：' + result.err);
    }
    if (result.errMsg !== undefined) {
      debug(`远程服务报错信息：${result.errMsg}`);
    }
    throw new ISoftError(result.errMsg, 503);
  }
}

// local test server for MIR service
async function uTest(ctx) {
  // debug(ctx.request);
  debug('uTest:')
  debug(ctx.request.files);
  var theImage = null;
  if (ctx.request.files && ctx.request.files.file) {
    const uploadImages = ctx.request.files.file;
    if (uploadImages.length && uploadImages.length > 1) {
      console.log('warning: recieved ' + uploadImages.length + ' images, use the first one');
      debug('warning: recieved ' + uploadImages.length + ' images, use the first one');
      theImage = uploadImages[0];
    } else {
      theImage = uploadImages;
    }
  } else {
    throw new ISoftError('No images in form-data: file')
  }
  // debug(theImage);
  // debug(ctx.request.files.name);
  ctx.body = {
    statusCode: 200,
    data: {
      heatmapImageUrl: "http://172.18.160.106:8080/cam/CXR1000_IM-0003-1001.png",
      captions: "the heart is normal in size."
    }
  };
}

module.exports = {
  parseMIR,
  uTest
};
