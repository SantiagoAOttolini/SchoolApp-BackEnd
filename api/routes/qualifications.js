const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Qualification = require("../models/qualification");
const Student = require("../models/student");
const checkAuth = require("../middleware/check-auth");

//GET
router.get("/", (req, res, next) => {
  Qualification.find()
    .populate("student")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        qualifications: docs.map((doc) => {
          return {
            _id: doc._id,
            student: doc.student,
            subject: doc.subject,
            note: doc.note,
            request: {
              type: "GET",
              url: "http://localhost:5000/qualifications/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//GET BY ID
router.get("/:qualificationId", (req, res, next) => {
  Qualification.findById(req.params.qualificationId)
    .populate("student")
    .exec()
    .then((qualification) => {
      if (!qualification) {
        return res.status(404).json({
          message: "Qualification not found",
        });
      }
      res.status(200).json({
        qualification: qualification,
        request: {
          type: "GET",
          url: "http://localhost:5000/qualifications",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//POST
router.post("/", checkAuth, (req, res, next) => {
  Student.findById(req.body.studentId)
    .then((student) => {
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
      const qualification = new Qualification({
        _id: mongoose.Types.ObjectId(),
        student: req.body.studentId,
        subject: req.body.subject,
        note: req.body.note,
      });
      qualification.populate("student").execPopulate();
      return qualification.save();
    })
    .then((result) => {
      if (res.statusCode === 404) {
        return res;
      }
      res.status(201).json({
        message: "Qualification stored",
        createdQualification: {
          _id: result._id,
          student: result.student,
          subject: result.subject,
          note: result.note,
        },
        request: {
          type: "GET",
          url: "http://localhost:5000/qualifications/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

//DELETE
router.delete("/:qualificationId", (req, res, next) => {
  const id = req.params.qualificationId;
  Qualification.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Qualification deleted",
        request: {
          type: "DELETE",
          url: "http://localhost:5000/qualifications",
          body: { qualificationId: id },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
