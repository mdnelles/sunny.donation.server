const express = require("express"),
   dbadmin = express.Router(),
   cors = require("cors"),
   pj = require("../components/config.json"),
   Donor = require("../models/Donor"),
   Playlist = require("../models/Playlist"),
   Layout = require("../models/Layout"),
   shell = require("shelljs"),
   db = require("../database/db"),
   config = require("../components/config.json"),
   rf = require("./RoutFuctions");

dbadmin.use(cors());

dbadmin.post("/restorfromnew2", rf.verifyToken, (req, res) => {
   let DBname = req.body.DBname;
   console.log("dbname: " + DBname);
   let dump = `mysqldump -u ${config.global.dbuser} -p${config.global.dbpassword} ${DBname} > ./tmp/${DBname}.sql`;
   console.log(" > " + dump);
   let copy = `mysql -u ${config.global.dbuser} -p${config.global.dbpassword} ${config.global.root_db_name} < ./tmp/${DBname}.sql`;
   //dump = 'pwd'
   shell.exec(dump, (code, output) => {
      shell.exec(copy, (code, output) => {
         res.json({
            success:
               "restored (MainDB:" +
               config.global.root_db_name +
               ") from " +
               DBname,
         }).end();
      });
   });
});

dbadmin.post("/restormain", rf.verifyToken, (req, res) => {
   let copy = `mysql -u ${config.global.dbuser} -p${config.global.dbpassword} ${config.global.root_db_name} < ./tmp/${config.global.root_db_name}_copy.sql`;
   shell.exec(copy, (code, output) => {
      res.json({
         success:
            "restored (MainDB:" +
            config.global.root_db_name +
            ") from sql file",
      }).end();
   });
});

dbadmin.post("/copyfromdb2", rf.verifyToken, (req, res) => {
   let DBname = req.body.DBname;
   // following command works at command line but not in program
   var dump = `mysqldump --column-statistics=0 -h ${config.global.host} -u ${config.global.user} -p${config.global.password} ${config.global.root_db_name} --set-gtid-purged=OFF | mysql -h ${config.global.host} -u ${config.global.user} -p${config.global.password}  ${DBname}  `;

   if (shell.exec(dump).code !== 0) {
      console.log(
         `ERR: ${config.global.root_db_name} *FAILED* copied to-> ${DBname} `
      );
      res.send("fail");
   } else {
      console.log(`${config.global.root_db_name} copied to-> ${DBname}`);
      res.send("success");
   }
});

dbadmin.post("/removedupes2", rf.verifyToken, (req, res) => {
   // establish that refering url is allowed
   var sql = `DELETE A
                    FROM  dtn_live.donors A,
                          dtn_live.donors B
                    WHERE  A.donorName = B.donorName AND  A.id > B.id`;
   db.sequelize
      .query(sql)
      .then((data) => {
         res.json({ success: data });
      })
      .catch((err) => {
         console.log("Client Error @ UserFunctions > get_donors" + err);
         res.status(404).send("Err #332 attempted to remove dupes").end();
      });
});

/*
 CREATE DATABASE IF NOT EXISTS myDb-${dateStamp};  
  GRANT ALL ON  myDb-${dateStamp}.* TO 'ROOT'@'localhost'; 
  CREATE USER 'TESTUSER'@'localhost' IDENTIFIED WITH mysql_native_password BY 'my-strong-password-h'; 
  GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON  
   myDb-${dateStamp}.* TO 'TESTUSER'@'localhOST'; 
  USE myDb-${dateStamp}; 
  CREATE TABLE Tablex SELECT * FROM Table1;"
*/

dbadmin.post("/createdb2", rf.verifyToken, (req, res) => {
   console.log("DbaRoutes > create db newDB-> " + req.body.newDbName);
   // establish that refering url is allowed
   if (req.body.newDbName !== undefined) {
      let newTable = config.global.root_db_name + req.body.newDbName;

      db.sequelize
         .query(`CREATE DATABASE IF NOT EXISTS ${newTable} `, {
            type: db.sequelize.QueryTypes.CREATE,
         })
         .then(() => {
            res.json({ success: "Created DB: " + req.body.newDbName }).end();
         })
         .catch((err) => {
            console.log("++err #300 problem with query => " + err);
            res.json({ error: "failed to create new" }).end();
         });
   }
});

dbadmin.post("/showdbs2", rf.verifyToken, (req, res) => {
   db.sequelize
      .query("show databases")
      .then(function (rows) {
         if (rows !== undefined) {
            //console.log('LOC routes / DbaRoutes / showdbs rows = ' +JSON.stringify(rows));
            var temp = JSON.stringify(rows);
            var arrOfDbNames = temp.toString().split('"');
            var showDbs = [config.global.root_db_name];
            arrOfDbNames.forEach((e, i) => {
               if (
                  e !== undefined &&
                  e.toString().includes(config.global.root_db_name)
               ) {
                  //check to see if it is already pushed because getting dupes
                  var alreadyPushed = false;
                  showDbs.forEach((e2, i) => {
                     if (e === showDbs[i]) alreadyPushed = true;
                  });
                  if (alreadyPushed === false) showDbs.push(e);
               }
            });

            showDbs.shift();
            res.json(showDbs).end();
         } else {
            console.log("Had a problem with query SHOW DATABASES");
            res.json({
               error: "failed(1) to get databases DbaRoutes.js: " + err,
            }).end();
         }
      })
      .catch((err) => {
         console.log("error: " + err);
         res.json({
            error: "failed(2) to get databases DbaRoutes.js: " + err,
         }).end();
      });
});

dbadmin.post("/removedb2", rf.verifyToken, (req, res) => {
   if (req.body.DBname !== config.global.db) {
      db.sequelize
         .query("DROP SCHEMA IF EXISTS " + req.body.DBname)
         .then(() => {
            res.json({ success: "db removed" }).end();
         })
         .catch((err) => {
            res.json({ fail: "db remove failed:" }).end();
            console.log(`failed to remove db: ${req.bodyDBname} Err= ` + err);
         });
   } else {
      res.send("can not delete root DB");
   }
});

dbadmin.post("/restore_data", rf.verifyToken, (req, res) => {
   //I
   Donor.destroy({
      where: {},
      truncate: true,
   }).then(() => {
      db.sequelize
         .query("INSERT INTO donors SELECT * FROM donors_backup")
         .then(() => {
            Playlist.destroy({
               where: {},
               truncate: true,
            }).then(() => {
               db.sequelize
                  .query("INSERT INTO playlists SELECT * FROM playlists_backup")
                  .then(() => {
                     Layout.destroy({
                        where: {},
                        truncate: true,
                     })
                        .then(() => {
                           db.sequelize
                              .query(
                                 "INSERT INTO playlist_layouts SELECT * FROM playlist_layouts_backup"
                              )
                              .then(() => {
                                 res.send("Data restored");
                              })
                              .catch((err) => {
                                 res.send(
                                    "data failed to restore step 3:" + err
                                 );
                                 console.log(err);
                              });
                        })
                        .catch((err) => {
                           res.send("data failed to restore step 2:" + err);
                           console.log(err);
                        });
                  })
                  .catch((err) => {
                     res.send("data failed to restore step 1:" + err);
                     console.log(err);
                  });
            });
         });
   });
});

module.exports = dbadmin;
