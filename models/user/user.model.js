var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  points: { type: Number, required: false, default: 0 },
  confirmed: { type: Boolean, required: false, default: false },
  unlocked: [{ type: mongoose.Schema.ObjectId, ref: 'Cuteness', required: false, default: [] }],
  login: { type: String, required: false, default: '' },
  preferences: {
    sendTime: { type: String, required: false, default: '' }
  }
});

module.exports = mongoose.model('User', UserSchema);