'use strict';

var fs = require('fs');
var ffmpeg=require('fluent-ffmpeg');

var cfg = {
    ssl: true,
    port: 8888,
    ssl_key: 'ssl.key',
    ssl_cert: 'ssl.crt'
};

var httpServ = (cfg.ssl) ? require('https') : require('http');

var WebSocketServer = require('ws').Server;

var app = null;


var processRequest = function(req, res) {
    res.writeHead(200);
    res.end('All glory to WebSockets!\n');
};

if (cfg.ssl) {
    app = httpServ.createServer({
       
        key: fs.readFileSync(cfg.ssl_key),
        cert: fs.readFileSync(cfg.ssl_cert)

    }, processRequest).listen(cfg.port);
} else {
    app = httpServ.createServer(processRequest).listen(cfg.port);
}


var wss = new WebSocketServer({
    server: app
});

wss.on('connection', function(wsConnect) {
    wsConnect.on('message', function(message) {
        console.log(message.length,message.toString('base64'));
        wsConnect.send('reply');
    });
});
