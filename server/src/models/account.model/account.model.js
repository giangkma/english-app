const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const { MAX, ACCOUNT_TYPES } = require('../../constant');
const { encrypt, crypto } = require('../../helper');

const accountTypeEnum = (function () {
  let list = [];
  for (let k in ACCOUNT_TYPES) {
    list.push(ACCOUNT_TYPES[k]);
  }
  return list;
})();

const accountSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    maxLength: MAX.USER_NAME,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    maxLength: MAX.EMAIL_LEN,
  },
  password: {
    type: String,
    default: '',
    maxLength: MAX.PASSWORD_LEN,
  },
  twoFASecret: {
    type: String,
  },
  authType: {
    type: String,
    enum: accountTypeEnum,
    default: ACCOUNT_TYPES.LOCAL,
  },
  createdDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
});

// hash password with bcrypt
// Note: callback should be a normal function -> use 'this'
accountSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const saltRounds = parseInt(process.env.SALT_ROUND);
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
    if (this.isModified('email')) {
      this.email = crypto.encrypt(this.email);
    }
    next();
  } catch (error) {
    next(error);
  }
});

accountSchema.set('toJSON', {
  transform: function (_, ret) {
    ret.is2FAEnabled = !!ret.twoFASecret;
    delete ret._id;
    delete ret.password;
    delete ret.__v;
    delete ret.twoFASecret;
  },
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
accountSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

const AccountModel = mongoose.model('accountV2', accountSchema, 'accountsV2');

module.exports = AccountModel;
