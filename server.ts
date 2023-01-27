import express, { Application } from "express";
import useRouter from "./src/routes/route";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

const port: number = parseInt(process.env.SERVER_PORT as string) || 5000;

app.listen(port, function () {
  console.log(`App is listening on port ${port} ${process.env.SERVER_PORT} !`);
});

app.use("/api", useRouter);
