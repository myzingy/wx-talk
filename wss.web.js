const fs = require('fs');
const talk = require('./util/talk')
const http = require('http')
const WebSocketServer = require('websocket').server
var stream = require('stream');
var cfg = {
  ssl: true,
  port: 8888,
  ssl_key: '/etc/nginx/ssl/vking.wang.key',
  ssl_cert: '/etc/nginx/ssl/fullchain.cer'
};
var  httpServer;
var httpServ = (cfg.ssl) ? require('https') : require('http');
if (cfg.ssl) {
  httpServer = httpServ.createServer({

    key: fs.readFileSync(cfg.ssl_key),
    cert: fs.readFileSync(cfg.ssl_cert)

  },(request, response) => {
    console.log('[' + new Date + '] Received request for ' + request.url)
    response.writeHead(404)
    response.end()
  })
} else {
  httpServer = httpServ.createServer((request, response) => {
    console.log('[' + new Date + '] Received request for ' + request.url)
    response.writeHead(404)
    response.end()
  })
}



const wsServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: true
})

wsServer.on('connect', connection => {
  connection.on('message', message => {
    console.log('message',message)
    if (message.type === 'utf8') {
      console.log('message.utf8Data:' + message.utf8Data)
      connection.sendUTF('reply:' + message.utf8Data)
    }
    if (message.type === 'binary') { //二进制Buffer
      //console.log('message.binaryData:~~')
      let file='tmp/aaa.mp3';
      /*
      talk.write(file,message.binaryData).then(filename=>{
        //connection.sendUTF('reply:mp3~~'+filename);
        talk.mp3(file,'wav').then(filename=>{
          //connection.sendUTF('reply:wav~~'+filename);
          talk.baiduApi(filename,'A'+Math.random()).then(res=>{
            if(res.result){
              console.log('baiduApi.res:',res.result)
              connection.sendUTF(res.result);
            }
          });
        })
      });
      */
      // 创建一个bufferstream
      var bufferStream = new stream.PassThrough();
      //将Buffer写入
      bufferStream.end(message.binaryData);
      //进一步使用
      bufferStream.pipe(process.stdout)

      talk.mp3buf(bufferStream,'tmp/aaa'+Math.random()+'.mp3','wav').then(filename=>{
        //connection.sendUTF('reply:~~'+filename);
        talk.baiduApi(filename,'A'+Math.random()).then(res=>{
          if(res.result){
            console.log('baiduApi.res:',res.result)
            connection.sendUTF(res.result);
          }
          fs.unlink(filename);
        });
      });
    }
  }).on('close', (reasonCode, description) => {
    console.log('Client Peer ' + connection.remoteAddress + ' disconnected.')
  })
})

httpServer.listen(cfg.port, () => {
  console.log('Serveris listening on port 8888')
})