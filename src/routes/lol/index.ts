import express from "express";
import Lol from "../../middlewares/lol/index";

const Router = express.Router();

Router.route("/version").get(Lol.getGameVersion);
Router.route("/userInfo/:username").get(Lol.getUserInfo);
Router.route("/userTier/:id").get(Lol.getUserTier);
Router.route("/userGameRecord/:puuid").get(Lol.getUserGameRecord);

export default Router;
