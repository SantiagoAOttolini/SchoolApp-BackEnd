//Requiers
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const studentsRoutes = require('./api/routes/students')
const qualificationsRoutes = require('./api/routes/qualifications')
const userRoutes = require('./api/routes/user');

//Express app
const app = express();

//Database connection
mongoose.connect(
    'mongodb+srv://ivansanti:ivansanti123@schoolapp-db-ekfvn.mongodb.net/test?retryWrites=true&w=majority',
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
)

//Morgan package
app.use(morgan('dev'))

//BodyParser package
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//CORS Errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Acces-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Autorization')
    if (req.method === 'OPTIONS') {
        res.header('Acces-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        return res.status(200).json({})
    }
    next();
})


//Routes
app.use('/students', studentsRoutes)
app.use('/qualifications', qualificationsRoutes)
app.use('/user', userRoutes)

//Error Handling
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