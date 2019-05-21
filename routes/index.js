const express = require('express');
const router  = express.Router();
const CV = require('../models/cv');


let isAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login")
  }
}
/* GET home page */
router.get('/', isAuthenticated, (req, res, next) => {
  let session = req.user
  CV.find()
  .then(cvs=>{
      console.log(session, 'session')
      res.render('index', {session, cvs});
    })
});



module.exports = router;
