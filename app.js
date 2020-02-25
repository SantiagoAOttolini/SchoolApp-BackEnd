
const express = require('express')
const morgan = require('morgan')

const app = express();

const studentsRoutes = require('./api/routes/students')

app.use(morgan('dev'))

app.use('/students', studentsRoutes)

app.use((req,res,next)=>{
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500)
    res.json({
        error:{
            message: error.message
        }
    })
})

module.exports = app