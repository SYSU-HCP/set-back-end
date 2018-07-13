const debug = require('debug')('hcp-set:api-recognition');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');
const recognition = require('../services/recognition');
const path = require('path');
const fs = require('fs');

const clothesImagesFolder = path.join(__dirname, `../../public/images/group4/`);
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

// 接收图片，将图片上传到计算服务器上
async function uploadImage(ctx) {
  debug(`第四组图像标签分类：收到上传图片请求`);
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
    throw new ISoftError('No images in form-data: img');
  }
  debug(`收到的图片文件名为：${theImage.name}`);

  var result = {};
  try {
    debug(`上传图片并计算...`);
    result = await recognition.uploadImgToServer(theImage);
  }
  catch (err) {
    debug(`可视化分析服务出现未知错误`);
    debug(err);
    debug(result);
  }
  return analyzeResult(ctx, result);
}
// 接收图片，将图片上传到计算服务器上
async function uploadImageUrl(ctx) {
  debug(`第四组图像标签分类：收到上传图片请求`);
  let theImage = {};
  // debug(ctx.request.body)
  // debug(ctx.request.body.img)
  if (ctx.request.body && ctx.request.body.img) {
    theImage.name = ctx.request.body.img;
    // debug(typeof(theImage.name))
    if (typeof (theImage.name) === "string") {
      theImage.path = clothesImagesFolder + theImage.name;
      debug(theImage);
      if (!fs.existsSync(theImage.path)) {
        throw new ISoftError('Image does not exist !')
      }
      var result = {};
      try {
        debug(`向智能分类服务器传送数据并分析...`);
        result = await recognition.uploadImgToServer(theImage);
      }
      catch (err) {
        debug(`智能分类服务出现未知错误`);
        debug(err);
        debug(result);
      }
      return analyzeResult(ctx, result);
    } else {
      throw new ISoftError('Wront image URL')
    }
  } else {
    throw new ISoftError('No images in body: img')
  }
}

module.exports = {
  uploadImage,
  uploadImageUrl
}