import express, { Application } from "express";

require("dotenv").config();

const app: Application = express();

const port: number = parseInt(process.env.SERVER_PORT as string) || 5000;

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});

app.use("/api", require("./src/routes/route"));
