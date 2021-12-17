module.exports = {
  secret: process.env.JWT_SECRET_KEY,
  jwtExpiration: 3600,
  jwtRefreshExpiration: 86400,

  // jwtExpiration: 1000,
  // jwtRefreshExpiration: 3600,
};
