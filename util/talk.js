var fs = require('fs');
var ffmpeg=require('fluent-ffmpeg');
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
      .audioBitrate('128k')
      // set audio codec
      .audioCodec('libmp3lame')
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
//module.exports =
module.exports={
  write:writeFile,
  mp3:mp3Format,
  mp3buf:mp3BufferFormat,
}