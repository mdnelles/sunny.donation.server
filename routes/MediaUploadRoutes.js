const fs = require("fs-extra"),
   formidable = require("formidable"),
   http = require("http"),
   util = require("util"),
   rf = require("./RoutFuctions");

http.createServer(function (req, res) {
   let refer = req.headers.referer;
   //using full path (not relative) because path changes depending on server being run as crontab or from prompt
   let pathToUploadFolder =
      "/var/www/sites/donation.nelles.io/client/build/upload/";
   if (refer !== undefined && refer.toString().includes(":3000"))
      pathToUploadFolder = "../client/public/upload/";

   console.log(req.url);
   if (req.url == "/uploadFile" && req.method.toLowerCase() == "post") {
      // parse a file upload
      var form = new formidable.IncomingForm();
      form.uploadDir = pathToUploadFolder;
      form.encoding = "binary";

      form.onPart = function (part) {
         if (part.filename) {
            console.log(part.filename);
            if (
               isInvalidFileName(part.filename) ||
               isInvalidMimeType(part.mime)
            ) {
               res.sendStatus(400);
            }
         }
      };
      //form.on('file', function (name, file) {
      form
         .on("field", function (field, value) {
            console.log(field, value);
         })
         /* this is where the renaming happens */
         .on("fileBegin", function (name, file) {
            var fileType = file.type.split("/").pop();
            console.log("here 0-");
            console.log("file .... ");
            console.log(file);
            /*          console.log('size = ' + file.size) // => string
               console.log('type = ' + file.type) // => mime type
               var fileName = file.name;
               var fileType = file.type;
               var fileSize = file.size;

               startUp(fileName, fileType, fileSize, res, form, path); */
         });

      const startUp = (fileName, fileType, fileSize, res, form, path) => {
         console.log("here 3");
         if (
            (fileType !== undefined && fileType.includes("image/")) ||
            fileType.includes("video/") ||
            fileType.includes("audio/")
         ) {
            // now test for size 10MB max
            if (parseInt(fileSize) > 11000000) {
               console.log("filesize too big for upload: " + fileSize);
               res.send(
                  "Error: File " +
                     fileName +
                     " is too large.  Maximum file size is 10MB."
               ).end();
            } else {
               form.parse(req, function (err, fields, files) {
                  console.log("file ok now uploading");
                  if (err) {
                     console.log(
                        "Error: File " +
                           files.files.name +
                           " has not been uploaded."
                     );
                     res.send(
                        "Error: File " +
                           files.files.name +
                           " has not been uploaded."
                     ).end();
                  } else {
                     ///////// passed all tests can now upload
                     var oldpath = files.files.path;
                     var newpath = path + files.files.name;
                     fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                        console.log(
                           "File: " + files.files.name + " has been uploaded."
                        );
                        res.send(
                           "File: " + files.files.name + " has been uploaded."
                        ).end();
                     });
                  }
               });
            }
         } else {
            console.log(
               "Error: File " +
                  files.files.name +
                  " is an illegal file type.  It must be an image audio or video file."
            );
            res.send(
               "Error: File " +
                  files.files.name +
                  " is an illegal file type.  It must be an image audio or video file"
            ).end();
         }
      };
   }
});

module.exports = http;
