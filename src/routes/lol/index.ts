import Lol from "../../middlewares/lol/index";

const Router = require("express").Router();

Router.route("/version").get(Lol.getGameVersion);
Router.route("/userInfo/:username").get(Lol.getUserInfo);

module.exports = Router;
