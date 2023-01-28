import { Router } from "express";
import Test from "./test/index";
import Lol from "./lol/index";

const useRouter = Router();

useRouter.use("/test", Test);
useRouter.use("/lol", Lol);

module.exports = useRouter;
