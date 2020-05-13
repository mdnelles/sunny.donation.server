const express         = require('express'),
			playlist        = express.Router(),
			cors            = require('cors'),
			pj              = require('../components/config.json'),
      uuidv1          = require('uuid/v1'),
      Playlist        = require('../models/Playlist'),
      Layout          = require('../models/Layout'),
      rf              = require('./RoutFuctions');


playlist.use(cors())

playlist.post('/updplaylistls2', rf.verifyToken, (req, res) => {

    console.log('removing playlist record id: ' + req.body.id )
    Playlist.update(
      { playListLayoutIdsStr: req.body.newString },
      { where : { id : req.body.pListId }}
    )
    .then(data => {
      res.send('ok')
    })
    .catch(err => {
      console.log("Error @ PlayListRoutes > remove playlist" + err)
      res.send('SQL failed to remove playlist').end()
    })

})

playlist.post('/removeplaylist2', rf.verifyToken,  (req, res) => {

    console.log('removing playlist record id: ' + req.body.id )
    Playlist.destroy({ where: 
      { id : req.body.id },
      limit: 1,
      force: true
    })
    .then(data => {
      res.send('ok')
    })
    .catch(err => {
      console.log("Error @ PlayListRoutes > remove playlist" + err)
      res.send('SQL failed to remove playlist').end()
    })

})

playlist.post('/removelayout2', rf.verifyToken, (req, res) => {

    console.log('removing layout record id: ' + req.body.id )
    Layout.destroy({ where: 
      { id : req.body.id },
      limit: 1,
      force: true
    })
    .then(data => {
      res.send('ok')
    })
    .catch(err => {
      console.log("Error @ PlayListRoutes > remove layout" + err)
      res.send('SQL failed to remove playlist').end()
    })

})


playlist.post('/addlayout2', rf.verifyToken, (req, res) => {

    const pData = {
      title: req.body.title,
      sequence_id: req.body.sequence_id,
      group: req.body.group,
      fadeIn: req.body.fadeIn,
      fadeOut: req.body.fadeOut,
      duration: req.body.duration,
      layout: req.body.layout,
      asset: req.body.asset,
      donorLevel: req.body.donorLevel,
      type: req.body.type,
      text: req.body.text,
      quote: req.body.quote,
    }
    Layout.create(pData)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log("Client Error @ PlayListRoutes > add layout" + err)
      res.send('SQL failed to add playlist').end()
    })

})

playlist.post('/addplaylist2', rf.verifyToken, (req, res) => {

    let uid = uuidv1()
    const pData = {
      playlist_key: uid,
      name: req.body.name,
      placement: req.body.placement,
      author: req.body.author,
      date: req.body.date,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      playOrder: req.body.playOrder,
      duration: req.body.duration,
      transDuration: req.body.transDuration,
      fadeIn: req.body.fadeIn,
      fadeOut: req.body.fadeOut,
      type: req.body.type,
      asset: req.body.asset,
      idp: req.body.idp,
      layout: req.body.layout,
      bgMovie: req.body.bgMovie,
      solo: req.body.solo,
      active:'true',
      num_list_items:'0'
    }
    Playlist.create(pData)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      console.log("Client Error @ PlayListRoutes > playlist" + err)
      res.send('SQL failed to add playlist').end()
    })

})

playlist.post('/getlayouts2', rf.verifyToken, (req, res) => {

    Layout.findAll()
    .then(data => {
      //console.log(JSON.stringify(data))
      res.send(data)
    })
    .catch(err => {
      console.log("Client Error @ UserFunctions > get layout" + err)
      res.send('SQL failed to get layout').end()
    })

})

playlist.post('/getplaylist2', (req, res) => {


      Playlist.findAll()
      .then(data => {
        //console.log(JSON.stringify(data))
        res.send(data)
      })
      .catch(err => {
        console.log("Client Error @ UserFunctions > get playlist" + err)
        res.send('SQL failed to get playlist').end()
      })

})

module.exports = playlist