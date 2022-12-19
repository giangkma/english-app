const {
  generateUniqueSecret,
  verifyOTPToken,
  generateOTPToken,
  generateQRCode,
} = require('../helper/2fa.js');
const { crypto } = require('../helper/index.js');
const accountService = require('../services/account.service');

exports.postEnable2FA = async (req, res) => {
  try {
    const { account } = req;
    const secret2FA = generateUniqueSecret();
    const serviceName = 'Amonino App';
    const otpAuth = generateOTPToken(account.username, serviceName, secret2FA);
    const QRCodeImage = await generateQRCode(otpAuth);
    await accountService.update2FASecret({
      username: account.username,
      secret: crypto.encrypt(secret2FA),
    });
    return res.send(QRCodeImage);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.postDisable2FA = async (req, res) => {
  try {
    const { twoFASecret, username } = req.account;
    const { otpToken } = req.body;
    const isValid = verifyOTPToken(otpToken, crypto.decrypt(twoFASecret));
    if (!isValid) {
      return res.status(400).json('Invalid OTP Token');
    }
    await accountService.update2FASecret({
      username: username,
      secret: null,
    });
    return res.status(200).json(true);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.postVerify2FA = async (req, res) => {
  try {
    const { twoFASecret } = req.account;
    const { otpToken } = req.body;
    const isValid = verifyOTPToken(otpToken, crypto.decrypt(twoFASecret));
    return res.status(200).json(isValid);
  } catch (error) {
    return res.status(500).json(error);
  }
};
