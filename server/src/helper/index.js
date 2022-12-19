const bcrypt = require('bcryptjs');
const { MAX } = require('../constant');
const CryptoJS = require('crypto-js');

// @fn: create an username for user by email, account id
// @ex: dyno2000@email.com, id: 127391212 => dyno200012739
exports.createUsername = (email = '', id = '') => {
  const idStr = id.toString();
  return (
    email.toString().split('@')[0] + idStr.slice(idStr.length - 5, idStr.length)
  );
};

exports.generateVerifyCode = numberOfDigits => {
  const n = parseInt(numberOfDigits);
  const number = Math.floor(Math.random() * Math.pow(10, n)) + 1;
  let numberStr = number.toString();
  const l = numberStr.length;
  for (let i = 0; i < MAX.VERIFY_CODE - l; ++i) {
    numberStr = '0' + numberStr;
  }
  return numberStr;
};

exports.hashPassword = async (password = '') => {
  const saltRounds = parseInt(process.env.SALT_ROUND);
  const hashPassword = await bcrypt.hash(password, saltRounds);
  return hashPassword;
};

exports.crypto = {
  encrypt: text => encrypt(text),
  decrypt: text => decrypt(text),
};

const encrypt = text => {
  try {
    console.log(process.env.AES_KEY);
    return CryptoJS.AES.encrypt(text, process.env.AES_KEY).toString();
  } catch (error) {
    throw error;
  }
};

const decrypt = text => {
  try {
    const decrypted = CryptoJS.AES.decrypt(text, process.env.AES_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw error;
  }
};
