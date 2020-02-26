const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Student = require('../models/student')

//GET
router.get('/', (req, res, next) => {
    Student.find()
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        lastname: doc.price,
                        age: doc.age,
                        class: doc.class,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:5000/students/'
                        }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        })
})

//GET BY ID
router.get('/:studentId', (req, res, next) => {
    const id = req.params.studentId
    Student.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    student: doc.name,
                    lastname: doc.lastname,
                    age: doc.age,
                    class: doc.class,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:5000/products/' + id
                    }
                })
                //REVISAR CONDICIONALES
            } else {
                res.status(404).json({ message: 'No valid entry found for provided ID' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
})

//POST
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
                        url: 'http://localhost:5000/students/'
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

//PATCH
router.patch('/:studentId', (req, res, next) => {
    const id = req.params.studentId
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }
    Student.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Student updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:5000/students/' + id
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

//DELETE
router.delete('/:studentId', (req, res, next) => {
    const id = req.params.studentId
    Student.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Student deleted',
                request: {

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
