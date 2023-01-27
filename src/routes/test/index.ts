import express from "express";
import Test from "../../middlewares/test";

const Router = express.Router();

Router.route("/").get(Test.getTestTable);

export default Router;
