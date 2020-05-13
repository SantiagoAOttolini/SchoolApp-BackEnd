const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require("../models/user");

router.get('/', (req, res, next) => {
  User.find()
      .exec()
      .then(docs => {  
        //Create Response
        const response = {     
          count: docs.length,
          //Student MAP       
          users: docs.map(doc => {           
            return {           
              name: doc.email,              
              lastname: doc.password,                                     
              _id: doc._id,           
              request: {
                          type: 'GET',
                          url: 'http://localhost:5000/user/' 
                      }
                  }
              })
          }
          //Status 200 = Ok
          res.status(200).json(response)
      })
      .catch(err => {
          console.log(err)
          //Status 500 = Database Error
          res.status(500).json({
              error: err
          })
      })
})

//Register
router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length >= 1) {
        //status 409 = conflict
          return res.status(409).json({
            message: "Mail exists"
          });
        } else {
            //BCRYPT Password encrypt
            bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
              });
              user
                .save()
                .then(result => {
                  console.log(result);
                  res.status(201).json({
                    message: "User created"
                  });
                })
                .catch(err => {
                  console.log(err);
                  res.status(500).json({
                    error: err
                  });
                });
            }
          });
        }
    });
});

//Login
router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(user => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        //Compare 2 passwords
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          //Correct Auth
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              'secret',
              //process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Auth failed"
          });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

router.delete("/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
    });
});

module.exports = router