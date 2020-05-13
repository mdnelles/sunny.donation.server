/*

NOT in use 
was used for download / now moved to client side

*/

/*
const express         = require('express')
const tmp             = express.Router()
const cors            = require('cors')

tmp.use(cors())

tmp.get('/:qry', (req, res) => {

    const file = `/tmp/${req.params.qry}`;
    res.download(file); // Set disposition and send it.

})

module.exports = tmp
*/