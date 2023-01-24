import Lol from "../../middlewares/lol/index";

const Router = require("express").Router();

Router.route("/version").get(Lol.getGameVersion);

module.exports = Router;
