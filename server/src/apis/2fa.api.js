const twoFAApi = require('express').Router();
const twoFAController = require('../controllers/2fa.controller');
const passportConfig = require('../middlewares/passport.middleware');

twoFAApi.post(
  '/enable',
  passportConfig.jwtAuthentication,
  twoFAController.postEnable2FA,
);

twoFAApi.post(
  '/disable',
  passportConfig.jwtAuthentication,
  twoFAController.postDisable2FA,
);

twoFAApi.post(
  '/verify',
  passportConfig.jwtAuthentication,
  twoFAController.postVerify2FA,
);

module.exports = twoFAApi;
