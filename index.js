import express from 'express';
import fs from 'fs';
import ytmux from 'ytdl-core-muxer';
import ejs from 'ejs';
import path from 'path';
import clear from 'console-clear';
import contentDisposition from 'content-disposition'
import favicon from 'serve-favicon'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express()

clear();

app.engine('.html', ejs.__express);
app.set('views', './src/views');
app.set('view engine', 'html');
app.use(express.static(path.join('./src/public')));
app.use(favicon(path.join(__dirname, 'src/public', 'icon/favicon.ico')))

app.get('/video', (req, res) => {
  if (!fs.existsSync('videos')) {
    fs.mkdirSync('videos');
  }
  let url = (req.query.url).toString();
  let quality = (req.query.q).toString();
  console.log('[ getting info... ]')
  ytmux.getInfo(url).then(info => {
    console.log(`Downloading: \x1b[33m${info.videoDetails.title}\x1b[0m (http://youtu.be/${url}) [QUALITY ITAG: ${quality}]`)
    ytmux(url, {quality: quality})
    .on('finish', function(){ console.log('\x1b[32mSuccess! Download finished!\x1b[0m')
    var file = path.join(__dirname,`/videos/${info.videoDetails.title}.mp4`)

    var filename = path.basename(file);

    res.writeHead(200, {
      'Content-Disposition': contentDisposition(filename),
      'Content-Transfer-Encoding': 'binary',
      'Content-Type': 'application/octet-stream'
  });
    fs.createReadStream(file).pipe(res);
    setTimeout(function(){fs.unlinkSync(file)}, 10000)
  } )
    .pipe(fs.createWriteStream('videos/'+info.videoDetails.title+'.mp4'))
  })
});

app.get('/audio', (req, res) => { 
  if (!fs.existsSync('audios')) {
    fs.mkdirSync('audios');
  }
  let url = (req.query.url).toString();
  let quality = (req.query.q).toString();
  console.log('[ getting info... ]')
  ytmux.getInfo(url).then(info => {
    console.log(`Downloading: \x1b[33m${info.videoDetails.title}\x1b[0m (http://youtu.be/${url}) [QUALITY ITAG: ${quality}]`)
    ytmux(url, {quality: quality, format: 'audioonly'})
    .on('finish', function(){ console.log('\x1b[34mSuccess! Download finished!\x1b[0m')
    var file = path.join(__dirname,`/audios/${info.videoDetails.title}.mp3`)

    var filename = path.basename(file);

    res.writeHead(200, {
      'Content-Disposition': contentDisposition(filename),
      'Content-Transfer-Encoding': 'binary',
      'Content-Type': 'application/octet-stream'
  });
    fs.createReadStream(file).pipe(res);
    setTimeout(function(){fs.unlinkSync(file)}, 10000)
  } )
    .pipe(fs.createWriteStream('audios/'+info.videoDetails.title+'.mp3'))
  })
});

app.get('/', function(req, res){
  res.send('<script>window.location.href="/download"</script>');
});
app.get('/download', function(req, res){
  res.render('index');
});
app.get('/soon', function(req,res){
  res.render('soon')
})
app.get('/*', function(req,res){
  res.render('404')
})
app.listen(80, function(){
  console.log('Listening on \x1b[34mhttp://localhost:80\x1b[0m');
});