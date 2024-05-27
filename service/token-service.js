const value = require("../_secret.js");
const queries = require("../queries/queries");
const jwt = require('jsonwebtoken');
const pool = require("../db");
require("dotenv").config();

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d'});
    return { accessToken, refreshToken };
  };

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch(e) {
      return null;
    }
  };

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch(e) {
      return null;
    }
  };

  async saveToken(id, refreshToken) {
    const tokenData = await pool.query(queries.checkIsToken , [ id ]);
    if (tokenData.rows.length > 0) {
      await pool.query(queries.updateToken, [ refreshToken, id ]);
    }

    const token = await pool.query(queries.addToken, [ id, refreshToken ]);
    return token;
  };

  async removeToken(refreshToken) {
    const tokenData = await pool.query(queries.removeToken, [ refreshToken ]);
    return tokenData;
  };

  async findToken(refreshToken) {
    const tokenData = await pool.query(queries.findToken, [ refreshToken ]);
    return tokenData;
  };
  
}

module.exports = new TokenService();