const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Qualification = require('../models/qualification')
const Student = require('../models/student')


router.post("/", (req, res, next) => {
    Student.findById(req.body.studentId)
      .then(student => {
        if (!student) {
          return res.status(404).json({
            message: "Student not found"
          });
        }
        const qualification = new Qualification({
          _id: mongoose.Types.ObjectId(),
          student: req.body.studentId,
          subject: req.body.subject,
          note: req.body.note
        });
        return qualification.save();
      })
      .then(result => {
          if(res.statusCode===404){
              return res;
          }
        res.status(201).json({
          message: "Qualification stored",
          createdQualification: {
            _id: result._id,
            student: result.student,
            subject: result.subject,
            note:result.note
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/qualifications/" + result._id
          }
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