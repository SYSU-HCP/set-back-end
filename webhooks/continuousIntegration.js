var http = require('http');
var spawn = require('child_process').spawn;
var createHandler = require('github-webhook-handler');
const config = require('./config');
// 下面填写的 myscrect 跟github webhooks配置一样；
// path是我们访问的路径
var handler = createHandler(config);

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location: ' + err.message);
  })
}).listen(8989);

console.log('start listen 8989 ...');

handler.on('error', function (err) {
  console.error('Error:', err.message);
})

// 监听到push事件的时候执行我们的自动化脚本
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
    runCommand('sh', ['./autoIntegration.sh'], function (txt) {
      console.log(txt);
    })
})

function runCommand(cmd, args, callback) {
  var child = spawn(cmd, args);
  var response = '';
  child.stdout.on('data', function (buffer) { response += buffer.toString() });
  child.stdout.on('end', function () { callback(response) });
}