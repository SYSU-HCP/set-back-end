const debug = require('debug')('hcp-set:api-visualize');
const { IResponse } = require('../utils/response');
const ISoftError = require('../utils/error');
const tagClassification = require('../services/tagClassification');

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

  var success = tagClassification.uploadImgToServer(theImage);
  if (success) {
    ctx.body = new IResponse(ctx, '上传成功', null, 200);
  } else {
    throw new Error('上传失败，请再试一次', 503);
  }
}

module.exports = {
  uploadImage
}