// Seeds file that remove all users and create 2 new users

// To execute this seed, run from the root of the project
// $ node bin/seeds.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/cvtheque-projet2', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

let cvs = [
  {
    cvUrl: "https://www.cvwizard.fr/assets/images/examples/7/cv-exemple-vert.png"
  },
  {
    cvUrl: "https://image.slidesharecdn.com/7f8f9113-08d5-439a-90d6-090510aa46ed-151216092705/95/cv-20154-1-638.jpg?cb=1450258045"
  },
  {
    cvUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRmXZlM2r4V5OrGMZ6krZrsDM42h__ioGJ8RTJVkDi32oSW5nO"
  }
]

let users = [
  {
    username: "alice",
    password: bcrypt.hashSync("alice", bcrypt.genSaltSync(bcryptSalt)),
    cv: 0
  },
  {
    username: "bob",
    password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
    cv: 0
  },
    {
      username: "Clara",
      password: bcrypt.hashSync("bob", bcrypt.genSaltSync(bcryptSalt)),
      cv: 0
    },
]

User.deleteMany()
.then(() => {
  return User.create(users)
})
.then(usersCreated => {
  console.log(`${usersCreated.length} users created with the following id:`);
  console.log(usersCreated.map(u => u._id));
})
.then(() => {
  // Close properly the connection to Mongoose
  mongoose.disconnect()
})
.catch(err => {
  mongoose.disconnect()
  throw err
})