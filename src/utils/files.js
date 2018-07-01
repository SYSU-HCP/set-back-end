const path = require('path');
const fs = require('fs');

const defaultUploadFolder = path.join(__dirname, `../../public/upload/`);
/**
 * @description 判断文件夹是否存在 如果不存在则创建文件夹
 */
function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

// 获得上传文件夹的名字
function getUploadDirName() {
  const date = new Date();
  let month = Number.parseInt(date.getMonth()) + 1;
  month = month > 9 ? month : `0${month}`;
  let day = Number.parseInt(date.getDate());
  day = day > 9 ? day : `0${day}`;
  const dir = `${date.getFullYear()}${month}${day}`;
  return dir;
}

function getUploadFileExt(name) {
  let ext = name.split('.');
  return ext[ext.length - 1];
}

function getUploadFileName(dir, name) {
  let count = 0;
  let theName = name;
  while (fs.existsSync(`${dir}/${theName}`)) {
    count++;
    theName = `${count}_${name}`
  }
  return theName;
}

function saveUploadFile(name, file) {
  // console.log(file);
  // 获取文件后缀
  // const ext = getUploadFileExt(file.name);
  // 最终要保存到的文件夹目录
  const dir = path.join(defaultUploadFolder, `${getUploadDirName()}`);
  // 检查文件夹是否存在如果不存在则新建文件夹
  checkDirExist(dir);
  // 重新覆盖 file.path 属性
  file.path = `${dir}/${getUploadFileName(dir, file.name)}`;
}
module.exports = {
  saveUploadFile
};