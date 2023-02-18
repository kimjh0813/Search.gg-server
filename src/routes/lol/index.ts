import Lol from "../../middlewares/lol/index";
import express from "express";

const Router = express.Router();

Router.route("/version").get(Lol.getGameVersion);
Router.route("/info/:username").get(Lol.getUserInfo);
Router.route("/tier/:id").get(Lol.getUserTier);
Router.route("/record/:puuid").get(Lol.getUserGameRecord);

export default Router;
