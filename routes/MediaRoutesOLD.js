
DEPRECIATED !!!!!!! 

const express       = require('express'),
	media          = express.Router(),
	cors           = require('cors'),
     fs             = require('fs-extra'),
     formidable     = require('formidable'),
     rf             = require('./RoutFuctions');

media.use(cors())


media.post('/uploadFile', rf.verifyToken, (req, res) => {
     
     const path = './client/public/upload/';

     var form = new formidable.IncomingForm();
     form.uploadDir = path;
     form.encoding = 'binary';
     console.log('form = ');
     console.log(req)
   

     
     form.parse(req, function(err, fields, files) {
          console.log('type = ' + files.files.type);
          console.log('size = ' + files.files.size);
          var fileType = files.files.type.toString();  // file filter considerations
          if(fileType !== undefined && (fileType.includes('image/')) || (fileType.includes('video/')) || (fileType.includes('audio/'))) {

                    // now test for size 10MB max
                    if(parseInt(files.files.size) > 12000000){
                         console.log('filesize too big for upload: ' + files.files.size);
                         res.send('Error: File ' + files.files.name + ' is too large.  Maximum file size is 10MB').end();          
                    } else {
                         console.log('file ok now uploading');
                         if (err) {
                              console.log('Error: File ' + files.files.name + ' has not been uploaded.');
                              res.send('Error: File ' + files.files.name + ' has not been uploaded.').end();
                         } else {
                              ///////// passed all tests can now upload
                              var oldpath = files.files.path;
                              var newpath = path + files.files.name;
                              fs.rename(oldpath, newpath, function (err) {
                                   if (err) throw err;
                                   console.log('File: ' + files.files.name + ' has been uploaded.');
                                   res.send('File: ' + files.files.name + ' has been uploaded.').end();
                                   
                              });
                         }
                    }

          } else {
               console.log('Error: File ' + files.files.name + ' is an illegal file type.  It must be an image audio or video file');
               res.send('Error: File ' + files.files.name + ' is an illegal file type.  It must be an image audio or video file').end();
          }

          
     });
})


module.exports = media