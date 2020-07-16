const mongoose = require("mongoose");

//Database STUDENT model
const studentSchema = mongoose.Schema({
  //ID generated automatically
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
});

module.exports = mongoose.model("Student", studentSchema);
