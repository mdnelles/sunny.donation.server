const express         = require('express'),
      donors          = express.Router(),
			cors            = require('cors'),
			Donor           = require('../models/Donor'),
			DonorCategory   = require('../models/DonorCategory'),
			db              = require('../database/db'),
			fs              = require('fs-extra'),
      formidable      = require('formidable'),
      rf              = require('./RoutFuctions');

donors.use(cors())

const updCounter = (DonorCategory,countsArr,count, res) => {

  if(countsArr[count] !== undefined && countsArr[count] !== null && countsArr[count].toString().includes(',')){
      var thisKey = countsArr[count][0]
      var thisCount = countsArr[count][1]
  }

  if(countsArr[count][0] !== undefined && countsArr[count][1] !== undefined){
      DonorCategory.update(
          {count: thisCount},
          {where : { donorKey : thisKey}}
      )
  }

  count++

  if(count < countsArr.length && count < 100){
      updCounter(DonorCategory,countsArr, count, res)
  } else {
      res.send('ok').end();
  }
}

donors.post('/randomizename2', rf.verifyToken, (req, res) => {

  Donor.findAll()
    .then(rows => {
      var randomDonorName = '', randomLetter = ''
      rows.forEach( (e) => {
        randomLetter = String.fromCharCode(65+Math.floor(Math.random() * 26))
        randomDonorName = randomLetter + '-Donor ' +  e.id

        Donor.update(
          { 
              donorName : randomDonorName,
              letter : randomLetter 
          },
          { where : { id : e.id }},
          { limit : 1 })
          .catch(err => {
              res.send('error trying to update random Donor id=' + e.id).end() 
              console.log('Err #115d trying update random Donor  : ' + err)
          })

      })
      setTimeout(() => {
        res.send('Donor Names have all been masked with Random String')
      }, 500);

    }).catch(err=> {
        console.log('Err 10f: ' +err)
        res.send('an error occured')
    })

})

donors.post('/updatecounters2', rf.verifyToken, (req, res) => {
  console.log('insdie routes > update counters > token = ' + req.body.token)
  Donor.findAll()
    .then(rows => {
        var obj = rows.reduce((a, {donorKey:s}) => (a[s] = (a[s] || 0) + 1, a), {})
        var countsArr = Object.keys(obj).map(i => { return [String(i), obj[i]]})
        updCounter(DonorCategory,countsArr,0, res)
    }).catch(err=> {
        console.log('Err 10fd: ' +err)
        res.send('an error occured')
    })

})

donors.post('/updatekey2', rf.verifyToken, (req, res) => {

  let tmp = JSON.stringify(req.body)
  tmp = tmp.toString().split('"')
  let newKey = tmp[3]
  let oldKey = tmp[7]



  Donor.update(
      { donorKey : newKey },
      { where : { donorKey : oldKey}})
      .then( ()=> {
        DonorCategory.update(
          { donorKey : newKey },
          { where : { donorKey : oldKey}})
            .then( ()=> {
              res.send('ok updated')
            })
            .catch( err=> {
              res.send('error occured trying to update donor catagories').end()
              console.log('err trying to update donor_cats.donorKey: ' + err)
            })
      })
      .catch(err => {
          res.send('error trying to update donors.donrKey').end() 
          console.log('Err #115c trying to delete donor group: ' + err)
      })

})

donors.post('/deletegroup2', rf.verifyToken, (req, res) => {

  Donor.destroy({
          where: { donorKey: req.body.donorKey }
      })
      .then( ()=> {
        res.send('ok group deleted').end()
      })
      .catch(err => {
          res.send('error trying to delete group').end() 
          //res.json({ error: 'An error occurred please contact the admin' })
          console.log('Err #115c trying to delete donor group: ' + err)
      })
})

donors.post('/adddonor2', rf.verifyToken, (req, res) => {

    Donor.findAll({ // must first get the highest donor order
      limit: 1,
      where: {donorKey:req.body.donorKey },
      order: [ [ 'donor_order', 'DESC' ]]})
      .then(data => {

        var donor_order = req.body.donor_order
        if(data[0].donor_order !== undefined){
            donor_order = parseInt(data[0].donor_order) + 1
        }
       
        const userData = {
          donorKey: req.body.donorKey,
          donorName: req.body.donorName,
          letter: req.body.letter,
          donor_order: donor_order
        }

        Donor.create(userData)
        .then( () => {
            res.send('ok').end() 
        })
        .catch(err => {
            res.send('ok').end() 
            //res.json({ error: 'An error occurred please contact the admin' })
            console.log('Err #115a trying to create donor: ' + err)
        })

      })
 
})

donors.post('/downloadcsv2', rf.verifyToken, (req, res) => {

  Donor.findAll()
    .then(data => {

      //console.log(res)

      let csvFileName = parseInt(Math.random(99,9999)*100000000) + '.csv',
        realPath = __dirname.toString().replace('routes','client/public/tmp'),
        csvFile = '',
        csvLine = ''
      //console.log(data)
      data.forEach( (e,i) => {  // iter out each JSON line

        //console.log(temp)
        if(e !== undefined){
          var temp = JSON.stringify(e);
          if(temp.toString().includes('"')){
            temp = temp.split(',')
            var [,id]         = temp[0].split(':')
            var [,donorKey]   = temp[1].split(':')
            var [,donorName]  = temp[2].split(':')
            var [,letter]     = temp[3].split(':')
            var [,donor_order]= temp[4].split(':')
            if(donor_order !== undefined) donor_order = donor_order.replace('}','')
            csvFile += id +',' + donorKey +',' + donorName + ',' +letter + ',' + donor_order + "\n"
          }
        }
      })
      fs.outputFile(realPath + '/' + csvFileName, csvFile)
        .then(() => res.send(csvFileName))
        .catch(err => {
          console.error('error writing CSV file ' +err)
          res.send('error writing CSV file')
        })

    })
    .catch(err => {
      console.log("Server Error @ DonorFunction > get_donors #1023: " + err)
      res.status(404).send('Error Location 102').end()
    })

})

donors.post('/uploadcsv2', (req, res) => {
  let fn = "dummy." + file.name.toString().toLowerCase();
  let fa = fn.split('.')
  if(fa[fa.length-1] === 'csv'){

    var fileName = ''
    new formidable.IncomingForm().parse(req)
    .on('fileBegin', (name, file) => {
        const realPath = __dirname.toString().replace('routes','tmp') 
        fileName = file.name
        file.path = realPath + '/' + file.name
    })
    .on('file', (name, file) => {
        res.send('file uploaded').end()
        console.log('fomidable upload completed')
    })
    .on('aborted', () => {
        console.error('Request aborted by the user')
        res.send('file aborted').end()
    })
    .on('error', (err) => {
        console.error('Error', err)
        throw err
        res.send('error:' + err).end()
    })
    .on('end', (name,file) => {
        console.log('upload end')
        // read file in to variable
        fs.readFile('./tmp/' +fileName, 'utf-8')
          .then(res => {
              var sqls = res.toString().split("\n")
              let numQueries = 1
              sqls.forEach( (e,i) => {
                  var field = sqls.toString().replace(/"/g,'').split(",")
                  //field[4] = field[4].toString().replace(/"/g,'')
                  Donor.create({
                      donorKey: field[1],
                      donorName: field[2],
                      letter: field[3],
                      donor_order: field[4]
                  }).then( qres => {
                    numQueries += 1
                    if(numQueries >= sqls.len){
                      res.json({Success: 'CSV queries uploaded'}).end()
                    }
                  }).catch( err=> {
                    res.json({fail: 'CSV queries uploaded failed'}).end()
                    console.log(err)
                  })
          
              })
        })
      })

  }
  
})

donors.post('/deletesql2', rf.verifyToken, (req, res) => {
  let thetable =  req.body.modelName.toLowerCase()
  let sql = ` DELETE FROM ${thetable}
                    WHERE id = '${req.body.id}' LIMIT 1 `
    
    //////// one more layer of security for SQL injection do not permit queries with ;
    if( ! sql.toString().includes(';') ){
      db.sequelize.query(sql)
      .then(sqlres => {res.send(sqlres); console.log('delete query success')})
      .catch(err => { res.status(404).send('Error 102'); console.log('err' + err) })
    } else {
      res.sendStatus(403).end()
      console.log('query abandoned found  ; in sql statement')
    }

})

donors.post('/updatesqldonors2', rf.verifyToken, (req, res) => {

  console.log(req.body)
    var cue = 0
    let ids = req.body.ids
    let vals = req.body.newVals
    let fields = req.body.fields
    let maxRecursive = 20                   // arbitratry number installed to truncate runaway loops
    function doUpdate(ids,vals,fields,cue){
      //Your_model.update({ field1 : 'foo' },{ where : { id : 1 }});
        //Donor.update({ [fields[cue]] : vals[cue] },{ where : { id : ids[cue]}}, { limit: 1 })
        console.log('ids.length = ' + ids.length)
        console.log('fields[cue] = ' + fields[cue])
        Donor.update({ [fields[cue]] : vals[cue] },{ where : { id : ids[cue]}}, { limit: 1 })
          .then( () => {
            cue +=1
            if(cue < ids.length || cue > maxRecursive) {
              console.log('about to call recursive')
              doUpdate(ids,vals,fields,cue)  //recursive call
            } else {
              res.send('completd a total of ' + cue + " queries.\nResults:\n").end();
            }
          })
    }
    // init
    doUpdate(ids,vals,fields,cue)

})

donors.post('/getdonors2', rf.verifyToken, (req, res) => {

    // establish that refering url is allowed
    Donor.findAll({
        where: {donorKey: req.body.rest },
      })
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        console.log("Server Error @ DonorFunction > get_donors #1022: " + err)
        res.status(404).send('Error Location 102').end()
      })

})

  donors.post('/donor_category2', rf.verifyToken, (req, res) => {

    DonorCategory.findAll()
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        console.log("Server Error @ DonorFunction > donor_category #1024: " + err)
        res.status(404).send('Error Location 102').end()
      })

  })

  module.exports = donors