const pool = require("../db");
const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const queries = require("../queries/queries");
const tokenService = require("./token-service");
const mailService = require("./mail-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exeption/api-error");
const values = require("../_secret");
require("dotenv").config();

class UserService {
  // REGISTRATION
  async registration(email, password) {
    const candidate = await pool.query(queries.checkIsUserByEmail, [email]);

    if (candidate.rows.length > 0) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже зарегистрирован`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = v4();

    await pool.query(queries.addUser, [email, hashPassword, activationLink]);
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );

    const user = await pool.query(queries.checkIsUserByEmail, [email]);

    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  // ACTIVATE
  async activate(activationLink) {
    const user = await pool.query(queries.checkIsUserByLink, [activationLink]);
    if (!user) {
      throw ApiError.BadRequest(`Некорректная ссылка активации`);
    }

    const userDto = new UserDto(user.rows[0]);
    await pool.query(queries.updateUserActivated, [true, userDto.id]);
  }

  // LOGIN
  async login(email, password) {
    const user = await pool.query(queries.checkIsUserByEmail, [email]);
    if (!user) {
      throw ApiError.BadRequest(`Пользоватедь с таким email не найден`);
    }

    const isPassEquels = await bcrypt.compare(password, user.rows[0].password);
    if (!isPassEquels) {
      throw ApiError.BadRequest(`Неверный пароль`);
    }

    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  // LOGOUT
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  // REFRESH
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError();
    }

    const user = await pool.query(queries.checkIsUserById, [userData.id]);
    const userDto = new UserDto(user.rows[0]);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  // GET ALL USERS
  async getAllUsers() {
    const users = await pool.query(queries.getUsers);
    return users;
  }
}

module.exports = new UserService();
