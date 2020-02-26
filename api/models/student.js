const mongoose = require('mongoose')


const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    age: {type: Number, required: true},
    class: {type: String, required: true}
})

module.exports = mongoose.model('student', studentSchema)