import Lol from "../../middlewares/lol/index";

const Router = require("express").Router();

Router.route("/version").get(Lol.getGameVersion);
Router.route("/userInfo/:username").get(Lol.getUserInfo);
Router.route("/userTier/:id").get(Lol.getUserTier);

module.exports = Router;
