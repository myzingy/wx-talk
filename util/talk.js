const PNUM=['ling','yi','er','san','si','wu','liu','qi','ba','jiu','shi']
var fs = require('fs');
var ffmpeg=require('fluent-ffmpeg');
var stream = require('stream');
var TR= require('transliteration');
function writeFile(fileName,dataBuffer){
  return new Promise(function(success,fail){
    fs.writeFile(fileName, dataBuffer, function(err) {
      console.log(fileName,err?',write fail':',write success')
      success(fileName);
    });
  })
}
function mp3Format(filename,format='pcm'){
  let outfile=filename.replace('.mp3','.'+format);
  return new Promise(function(success,fail){
    var command = ffmpeg(filename)
      // set audio bitrate
      .audioBitrate(16000)
      // set audio codec
      //.audioCodec('libmp3lame')
      // set number of audio channels
      .audioChannels(1)
      // set output format to force
      .format(format)
      // setup event handlers
      .on('end', function() {
        console.log('file has been converted succesfully');
        success(outfile);
      })
      .on('error', function(err) {
        console.log('an error happened: ' + err.message);
        fail(err)
      })
      // save to file
      .save(outfile);
  })
}
function mp3BufferFormat(buffer,filename,format='pcm'){
  let outfile=filename.replace('.mp3','.'+format);
  return new Promise(function(success,fail){
    var command = ffmpeg(buffer)
    // set audio bitrate
      .audioBitrate(96000)
      //set audio frequency
      .audioFrequency(16000)
      // set audio codec
      //.audioCodec('libmp3lame')
      // set number of audio channels
      .audioChannels(1)
      // set output format to force
      .format(format)
      // setup event handlers
      .on('end', function() {
        console.log('file has been converted succesfully');
        success(outfile);
      })
      .on('error', function(err) {
        console.log('an error happened: ' + err.message);
        fail(err)
      })
      // save to file
      .save(outfile);
  })
}
function baiduApi(wavFile,cuid){
  var AipSpeechClient = require("baidu-aip-sdk").speech;
  // 设置APPID/AK/SK
  var APP_ID = "14949012";
  var API_KEY = "RbdHgqPIX0P7ZimYjZInpW7U";
  var SECRET_KEY = "Hl3cS6v53GHkSZkmx2BBO6G6vlb7b2KR";

  // 新建一个对象，建议只保存一个对象调用服务接口
  var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);

  var HttpClient = require("baidu-aip-sdk").HttpClient;

  HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    //console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
  });

  let voice = fs.readFileSync(wavFile);

  let voiceBuffer = new Buffer(voice);

  // 识别本地文件，附带参数
  return client.recognize(voiceBuffer, 'wav', 16000, {dev_pid: '1536', cuid: cuid})
}
function parseNums(str){
  if(!str) return "";
  let pins=TR.slugify(str);
  console.log('baiduApi.pins:',pins)
  pins=pins.split('-');
  let nums=[];
  pins.forEach(p=>{
    nums.push(PNUM.indexOf(p))
  })
  return nums.toString();
}
//module.exports =
module.exports={
  write:writeFile,
  mp3:mp3Format,
  mp3buf:mp3BufferFormat,
  baiduApi:baiduApi,
  parseNums:parseNums,
}