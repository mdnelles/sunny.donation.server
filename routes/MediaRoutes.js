const express = require('express'),
   media = express(),
   cors = require('cors'),
   fs = require('fs-extra'),
   fileUpload = require('express-fileupload'),
   rf = require('./RoutFuctions');

media.use(cors());
media.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

media.post('/uploadfile', rf.verifyToken, function(req, res) {
   var mime = req.files.files.mimetype.toString();

   //if(fn.includes(".php") || fn.includes(".js") ||  fn.includes(".pl") || fn.includes(".htm")|| fn.includes(".exe") || fn.includes(".txt") || !fn.includes(".")){
   if (
      mime.includes('image') ||
      mime.includes('audio') ||
      mime.includes('video')
   ) {
      req.files.files.mv(
         '../client/public/upload/' + req.files.files.name,
         function(err) {
            if (err) {
               console.log('Error: ' + err);
               res.send('Upload failed' + err).end();
            } else {
               console.log('Uploaded ok');
               //res.write("<img src=\"/uploads/up/"+fn+"\" class=\"ui image\" width=\"290\" height=\"160\">");
               res.end('File uploaded successfully');
            }
         }
      );
   } else {
      console.log('Illegal file type');
      res.send('Illegal file type').end();
   }
});

media.post('/getmedia', rf.verifyToken, (req, res) => {
   const path = '../client/public/upload/';

   var arr = []; // this will be an array of objects

   fs.readdirSync(path, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map(function(item, index) {
         o = {
            name: item.name,
            bgc: '-'
         };
         arr.push(o);
      });

   res.send(arr);
});

media.post('/removeFile', rf.verifyToken, (req, res) => {
   console.log('in removeFile');
   const path = '../client/public/upload/';
   const fileName = req.body.fileName;

   // With Promises:
   fs.remove('/tmp/myfile');
   fs.remove(path + fileName)
      .then(() => {
         console.log('success delete file: ' + fileName);
         res.send('ok').end();
      })
      .catch((err) => {
         console.error('Failed in deleting file ' + fileName + ' Err: ' + err);
         res.send('failed to delete file').end();
      });
});

module.exports = media;
