import express, { Application, Request, Response } from "express";

require("dotenv").config();

const app: Application = express();

const port: number = parseInt(process.env.SERVER_PORT as string) || 5000;

const maria = require("./src/database/maria");

// maria.connection();

app.get("/test", (req: Request, res: Response) => {
  maria.query("select * from testTable", function (err: any, rows: any) {
    if (!err) {
      console.log("secc");
      res.send(rows);
    } else {
      console.log("err: ", err);
    }
  });
});

app.listen(port, function () {
  console.log(`App is listening on port ${port} !`);
});
