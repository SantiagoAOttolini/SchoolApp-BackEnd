const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Qualification = require('../models/qualification')
const Student = require('../models/student')

//GET
router.get("/", (req, res, next) => {
    Qualification.find()
      .populate('student', 'name')
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          qualifications: docs.map(doc => {
            return {
              _id: doc._id,
              student: doc.student,
              subject: doc.subject,
              note: doc.note,
              request: {
                type: "GET",
                url: "http://localhost:5000/qualifications/" + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });


//POST
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