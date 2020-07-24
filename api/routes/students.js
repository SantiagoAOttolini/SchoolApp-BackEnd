//Requires
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../models/student");
const checkAuth = require("../middleware/check-auth");
const Qualification = require("../models/qualification");
const qualification = require("../models/qualification");
const { response } = require("express");

//GET Request
router.get("/", (req, res, next) => {
  Student.find()
    .exec()
    .then((docs) => {
      //Create Response
      const response = {
        count: docs.length,
        //Student MAP
        students: docs.map((doc) => {
          return {
            name: doc.name,
            lastname: doc.lastname,
            age: doc.age,
            class: doc.class,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:5000/students/",
            },
          };
        }),
      };
      //Status 200 = Ok
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      //Status 500 = Database Error
      res.status(500).json({
        error: err,
      });
    });
});

//GetByID Request
router.get("/:studentId", (req, res, next) => {
  //Take ID from the URL
  const id = req.params.studentId;
  Student.findById(id)
    .exec()
    .then((doc) => {
      // !!CONDITIONAL NOT WORKING!! FIX NEEDED
      if (doc) {
        res.status(200).json({
          student: doc.name,
          lastname: doc.lastname,
          age: doc.age,
          class: doc.class,
          request: {
            type: "GET",
            url: "http://localhost:5000/students/" + id,
          },
        });
      } else {
        //Status 404 = Not Found
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

//POST Request
router.post("/", checkAuth, (req, res, next) => {
  //Create Student instance
  const student = new Student({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    lastname: req.body.lastname,
    age: req.body.age,
    class: req.body.class,
  });
  //Save on database
  student
    .save()
    .then((result) => {
      console.log(result);
      //Status 201 = Created
      res.status(201).json({
        message: "Student created succesfully",
        createdStudent: {
          name: result.name,
          lastname: result.lastname,
          age: result.age,
          class: result.class,
          _id: result.id,
          request: {
            type: "POST",
            url: "http://localhost:5000/students/",
          },
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

//PATCH Request
router.patch("/:studentId", checkAuth, (req, res, next) => {
  const id = req.params.studentId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Student.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Student updated",
        request: {
          type: "GET",
          url: "http://localhost:5000/students/" + id,
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

//DELETE Request
router.delete("/:studentId", (req, res, next) => {
  const id = req.params.studentId;
  Qualification.find({ student: id })
    .exec()
    .then((response) => {
      if (response && response.length) {
        res.status(403).json({
          error: "Can´t delete a student with qualifications",
        });
      } else {
        Student.remove({ _id: id })
          .exec()
          .then((result) => {
            res.status(200).json({
              message: "Student deleted",
              request: {},
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({
              error: err,
            });
          });
      }
    });
  //Remove student with id
});

module.exports = router;
