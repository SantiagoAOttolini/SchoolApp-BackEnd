/*import Express from "express";*/
const express = require('express')
const app = express();

const studentsRoutes = require('./api/routes/students')

app.use('/students', studentsRoutes)

module.exports = app