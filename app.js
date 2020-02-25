
const express = require('express')
const morgan = require('morgan')

const app = express();

const studentsRoutes = require('./api/routes/students')

app.use(morgan('dev'))

app.use('/students', studentsRoutes)

module.exports = app