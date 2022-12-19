const { ACCOUNT_TYPES, MAX } = require('../constant');
const { hashPassword } = require('../helper');
const AccountModel = require('../models/account.model/account.model');
const UserModel = require('../models/account.model/user.model');
const { uploadImage } = require('./common.service');

exports.isExistAccount = async username => {
  try {
    return await AccountModel.exists({ username });
  } catch (error) {
    throw error;
  }
};

exports.findAccount = async username => {
  try {
    return await AccountModel.findOne({ username });
  } catch (error) {
    throw error;
  }
};

exports.update2FASecret = async ({ username, secret }) => {
  try {
    return await AccountModel.updateOne({ username }, { twoFASecret: secret });
  } catch (error) {
    throw error;
  }
};

exports.createAccount = async (
  username,
  email,
  password,
  authType = ACCOUNT_TYPES.LOCAL,
) => {
  try {
    const newAccount = await AccountModel.create({
      username,
      email,
      password,
      authType,
      createdDate: new Date(),
    });
    if (newAccount && newAccount._id) return newAccount._id;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.createUser = async (accountId, username, name, avt = '') => {
  try {
    const newUser = await UserModel.create({ accountId, name, username, avt });
    if (newUser && newUser._id) return newUser;
    return null;
  } catch (error) {
    throw error;
  }
};

exports.isExistWordInFavorites = async (word, username) => {
  try {
    const regex = new RegExp(word, 'i');
    const isExist = await UserModel.exists({
      username,
      favoriteList: {
        $in: regex,
      },
    });

    return isExist;
  } catch (error) {
    throw error;
  }
};

exports.isLimitedFavorites = async (word, username) => {
  try {
    // check limit amount
    const user = await UserModel.findOne({ username }).select('favoriteList');
    const { favoriteList = null } = user;

    if (
      Array.isArray(favoriteList) &&
      favoriteList.length >= MAX.FAVORITES_LEN
    ) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateFavoriteList = async (word, username, isAdd = false) => {
  try {
    if (isAdd) {
      return await UserModel.updateOne(
        { username },
        { $push: { favoriteList: word } },
      );
    }

    return await UserModel.updateOne(
      { username },
      { $pull: { favoriteList: { $in: word } } },
    );
  } catch (error) {
    throw error;
  }
};

exports.updateUserCoin = async (newCoin = 0, username = '') => {
  try {
    if (
      newCoin < 0 ||
      newCoin > MAX.USER_COIN ||
      !username ||
      username === ''
    ) {
      return false;
    }

    const updateRes = await UserModel.updateOne(
      { username },
      { coin: newCoin },
    );

    if (updateRes.ok) {
      return true;
    }
  } catch (error) {
    throw error;
  }
};

exports.updatePassword = async (username = '', newPassword = '') => {
  try {
    const hashPw = await hashPassword(newPassword);

    const res = await AccountModel.updateOne(
      { username },
      { password: hashPw },
    );

    if (res.ok) {
      return true;
    }

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateAvt = async (username = '', avtSrc = '') => {
  try {
    const picture = await uploadImage(avtSrc, 'amonino/user-avt');
    const isUpdated = await UserModel.updateOne({ username }, { avt: picture });
    if (isUpdated.n && isUpdated.ok) return picture;

    return false;
  } catch (error) {
    throw error;
  }
};

exports.updateProfile = async ({ username, data }) => {
  try {
    await UserModel.updateOne({ username }, data);
    await AccountModel.updateOne({ username }, data);

    return true;
  } catch (error) {
    throw error;
  }
};

exports.getProfile = async (accountId = '') => {
  try {
    const account = await AccountModel.findById(accountId);
    return account;
  } catch (error) {
    throw error;
  }
};
