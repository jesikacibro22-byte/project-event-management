const validateRegister = (req, res, next) => {
  console.log('Validating register data...');
  next();
};

const validateLogin = (req, res, next) => {
  console.log('Validating login data...');
  next();
};

const validateUpdateUser = (req, res, next) => {
  console.log('Validating update user data...');
  next();
};

module.exports = { validateRegister, validateLogin, validateUpdateUser };