const { cloudinary } = require('../configs/cloudinary.config');
const { MAX } = require('../constant');
const { convertPackInfoToQueryStr } = require('../helper/word-pack.helper');
const VerifyCodeModel = require('../models/account.model/verifyCode.model');
const SentenceModel = require('../models/sentence.model');
const WordModel = require('../models/word.model');

exports.uploadImage = async (imgSrc, folderName = '', config = {}) => {
  try {
    const result = await cloudinary.uploader.upload(imgSrc, {
      folder: folderName,
      ...config,
    });
    const { secure_url = null } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};

exports.isExistWord = async (word = '', type = '') => {
  try {
    if (word === '' || type === '') {
      return false;
    }

    return await WordModel.exists({ word, type });
  } catch (error) {
    throw error;
  }
};

exports.isExistSentence = async (sentence = '') => {
  if (sentence === '') return false;
  const newRegex = new RegExp(sentence, 'i');
  return await SentenceModel.exists({ sentence: newRegex });
};

exports.getWordPack = async (
  packInfo = {},
  skip = 0,
  limit = 500,
  select = '',
  sortType = null,
  expandQuery = null,
) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);

    // add expand query
    if (expandQuery && typeof expandQuery === 'object') {
      Object.assign(query, expandQuery);
    }

    const packList = await WordModel.find(query)
      .sort({ word: sortType })
      .skip(skip)
      .limit(limit)
      .select(select);

    return packList;
  } catch (error) {
    throw error;
  }
};

exports.getCountWordPackByTopicId = async topicId => {
  try {
    const result = await WordModel.countDocuments({
      topics: { $in: [topicId] },
    });
    return result;
  } catch (error) {
    throw error;
  }
};

exports.getWordPackByTopicId = async topicId => {
  try {
    const result = await WordModel.find({ topics: { $in: [topicId] } });
    return result;
  } catch (error) {
    throw error;
  }
};

exports.countWordPack = async (packInfo = {}) => {
  try {
    let query = convertPackInfoToQueryStr(packInfo);
    return await WordModel.countDocuments(query);
  } catch (error) {
    throw error;
  }
};

exports.saveVerifyCode = async (code = '', username = '') => {
  try {
    // delete old code
    await VerifyCodeModel.deleteOne({ username });

    const newItem = await VerifyCodeModel.create({
      code,
      username,
      createdDate: new Date(),
    });
    return newItem;
  } catch (error) {
    throw error;
  }
};

exports.checkVerifyCode = async (code = '', username = '') => {
  try {
    const item = await VerifyCodeModel.findOne({ username });

    if (!item) {
      return {
        status: false,
        message: 'No verification code exists for username : ' + username,
      };
    }

    if (item.code !== code) {
      return {
        status: false,
        message: 'The verification code is not correct.',
      };
    }

    const d = new Date().getTime(),
      createdDate = new Date(item.createdDate).getTime();

    if (d - createdDate > MAX.VERIFY_TIME) {
      return {
        status: false,
        message: "The verification code has expired. Let's get another code",
      };
    }

    return { status: true, message: 'valid' };
  } catch (error) {
    throw error;
  }
};

exports.removeVerifyCode = async (username = '') => {
  await VerifyCodeModel.deleteOne({ username });
};
