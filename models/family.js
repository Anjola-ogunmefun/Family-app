const mongoose = require('mongoose');

const { Schema } = mongoose;

const FamilySchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
      },
      gender: {
        type: String,
        required: true,
    },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    age: {
        type: Number,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true,
        minlength: 5,
        maxlength: 14,
        unique: true
    },
 },
 {
  timestamps: true,
}
);

 const FamilyModel = mongoose.model('myFamily', FamilySchema);
 module.exports = FamilyModel;