const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express();

const studentsRoutes = require('./api/routes/students')
const qualificationsRoutes = require('./api/routes/qualifications')

mongoose.connect(
    'mongodb+srv://ivansanti:ivansanti123@schoolapp-db-ekfvn.mongodb.net/test?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
)

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Acces-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Autorization')
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next();
})

app.use('/students', studentsRoutes)
app.use('/qualifications', qualificationsRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app