const userService = require("../service/user-service");
const values = require("../_secret");
require("dotenv").config();
const { validationResult } = require("express-validator");
const ApiError = require("../exeption/api-error")

class UserController {
  // REGISTRATION
  async registration(req, res, next) {
    const errors = validationResult(req);
    const { email, password } = req.body;
    try {
      if (!errors.isEmpty()) {
        throw ApiError.BadRequest('Ошибка при валидации данных', errors.array());
      }
      const userData = await userService.registration(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
      // return res.status(200).json({ message: `Пользователь с почтовым адресом ${email} успешно зарегистрирован` });
    } catch (e) {
      next(e);
    }
  }

  // ACTIVATE
  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await userService.activate(link);
      return res.redirect(process.env.CLIENT_URL);
      // res.status(200).json({ sucsess: "Аккаунт активирован" });
    } catch (e) {
      next(e)
    }
  }

  // LOGIN
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
      // res.status(200).json({ message: `Пользователь успешно залогирован` });
    } catch (e) {
      next(e);
    }
  }

  // LOGOUT
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.status(200).json({ message: `Пользователь успешно разлогирован` });
    } catch (e) {
      next(e)
    }
  }

  // REFRESH
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
    } catch (e) {
      next(e)
    }
  }

  // GET ALL USERS
  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users.rows);
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController();
