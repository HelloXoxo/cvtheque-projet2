const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");
// File upload
var multer = require("multer");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const Cv = require('../models/cv');


router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === "" || password === "") {
    res.render("/auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("auth/signup", { message: "Something went wrong" });
    })
  });
});

router.get("/logout", (req, res) => {
  console.log("logout trigger");
  
  req.logout();
  res.redirect("/");
});

// Route to upload from project base path
const upload = multer({ dest: './public/uploads/' });

router.get('/upload', (req, res) => {
  res.render("auth/upload")
})

router.get('/cv/:id', function(req, res, next) {
  Cv.findById(req.params.id)
  .then(cv => {
    res.render('cv', {cv, path: cv.path})
    console.log("cv name", cv.name);
    console.log("cv path", cv.path);
  })
  // Cv.findById((err, cv) => {
  //   res.render('cv', {cv})
  //   console.log("cv name", cv.name);
    
  // })
});

router.post('/upload', upload.single('pdf'), (req, res) => {

  const pic = new Cv({
    name: req.body.name,
    path: `/uploads/${req.file.filename}`
  });

  pic.save((err) => {
    console.log("err")
    console.log(err);
      res.redirect('/');
  });
});

module.exports = router;
