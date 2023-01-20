import Test from "../../middlewares/test";

const Router = require("express").Router();

Router.route("/").get(Test.getTestTable);

module.exports = Router;
