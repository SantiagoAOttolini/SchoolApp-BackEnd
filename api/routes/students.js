const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Student = require('../models/student') 

router.post('/', (req, res, next) => {
  console.log(req.file)
  const student = new Student({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      lastname: req.body.lastname,
      age: req.body.age,
      class: req.body.class
  })

  student.save()
      .then(result => {
          console.log(result)
          res.status(201).json({
              message: 'Student created succesfully',
              createdProduct: {
                  name: result.name,
                  lastname: result.lastname,
                  age: result.age,
                  class: result.class,
                  _id: result.id,
                  request: {
                      type: 'POST',
                      url: 'http://localhost:5000/products/'
                  }
              }     
          })
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({
              error: err
          })
      })
})

module.exports = router
