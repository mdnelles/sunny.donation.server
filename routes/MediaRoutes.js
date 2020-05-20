const express = require("express"),
   media = express(),
   cors = require("cors"),
   fs = require("fs-extra"),
   fileUpload = require("express-fileupload"),
   rf = require("./RoutFuctions");

media.use(cors());
media.use(fileUpload({ safeFileNames: true, preserveExtension: true }));

media.post("/uploadfile", rf.verifyToken, function (req, res) {
   // establish if it is in developement (on port :3000) or in productions - post to appropriate upload path
   let refer = req.headers.referer;
   //using full path (not relative) because path changes depending on server being run as crontab or from prompt
   let pathToUploadFolder =
      "/var/www/sites/donation.nelles.io/client/build/upload/";
   if (refer !== undefined && refer.toString().includes(":3000"))
      pathToUploadFolder = "../client/public/upload/";

   var mime = req.files.files.mimetype.toString();
   console.log(req.files.files);

   //if(fn.includes(".php") || fn.includes(".js") ||  fn.includes(".pl") || fn.includes(".htm")|| fn.includes(".exe") || fn.includes(".txt") || !fn.includes(".")){
   if (
      mime.includes("image") ||
      mime.includes("audio") ||
      mime.includes("video")
   ) {
      req.files.files.mv(pathToUploadFolder + req.files.files.name, function (
         err
      ) {
         if (err) {
            console.log("Error: " + err);
            res.send("Upload failed" + err).end();
         } else {
            console.log("Uploaded ok");
            //res.write("<img src=\"/uploads/up/"+fn+"\" class=\"ui image\" width=\"290\" height=\"160\">");
            res.end("File uploaded successfully");
         }
      });
   } else {
      console.log("Illegal file type");
      res.send("Illegal file type").end();
   }
});

media.post("/getmedia", rf.verifyToken, (req, res) => {
   let refer = req.headers.referer;
   //using full path (not relative) because path changes depending on server being run as crontab or from prompt
   let pathToUploadFolder =
      "/var/www/sites/donation.nelles.io/client/build/upload/";
   if (refer !== undefined && refer.toString().includes(":3000"))
      pathToUploadFolder = "../client/public/upload/";

   var arr = []; // this will be an array of objects

   fs.readdirSync(pathToUploadFolder, { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map(function (item, index) {
         o = {
            name: item.name,
            bgc: "-",
         };
         arr.push(o);
      });

   res.send(arr);
});

media.post("/removeFile", rf.verifyToken, (req, res) => {
   let refer = req.headers.referer;
   //using full path (not relative) because path changes depending on server being run as crontab or from prompt
   let pathToUploadFolder =
      "/var/www/sites/donation.nelles.io/client/build/upload/";
   if (refer !== undefined && refer.toString().includes(":3000"))
      pathToUploadFolder = "../client/public/upload/";
   const fileName = req.body.fileName;

   // With Promises:
   fs.remove("/tmp/myfile");
   fs.remove(pathToUploadFolder + fileName)
      .then(() => {
         console.log("success delete file: " + fileName);
         res.send("ok").end();
      })
      .catch((err) => {
         console.error("Failed in deleting file " + fileName + " Err: " + err);
         res.send("failed to delete file").end();
      });
});

module.exports = media;
