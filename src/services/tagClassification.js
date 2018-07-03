var fs = require('fs');
var child_process = require('child_process');
const debug = require('debug')('hcp-set:tagClassification');

const sshUrl = ' shixun4@172.18.160.97:/data1/group4/final_project/realimg/';

class tagClassificatoin {
  // @param img the image to upload to server
  // @return true or false
  uploadImgToServer(img) {
    var cmd = 'scp ' + img.path + sshUrl;
    debug(`上传图片：${cmd}`);
    try {
      var scp = child_process.execSync(cmd, {encoding: 'utf-8'});
      debug(`上传图片完成：${scp.stdout.toString()}`);
    } catch (err) {
      debug(`上传图片失败：${err}`)
      return false;
    }
    return true;
  }
}

module.exports = new tagClassificatoin();