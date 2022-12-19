const mongoose = require('mongoose');
const { MAX } = require('../../constant');
const Schema = mongoose.Schema;

const verifyCodeSchema = new Schema({
  code: {
    type: String,
    maxLength: MAX.VERIFY_CODE,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    maxLength: MAX.USER_NAME,
    required: true,
    trim: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

const VerifyCodeModel = mongoose.model(
  'verifyCodeV2',
  verifyCodeSchema,
  'verifyCodesV2',
);

module.exports = VerifyCodeModel;
