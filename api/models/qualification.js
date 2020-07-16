const mongoose = require("mongoose");

//Database QUALIFICATION models
const qualificationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  subject: { type: String, required: true },
  note: { type: Number, required: true },
});

module.exports = mongoose.model("Qualification", qualificationSchema);
