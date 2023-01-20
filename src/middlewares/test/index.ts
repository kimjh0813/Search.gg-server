import { Request, Response } from "express";

const maria = require("../../database/maria");

const getTestTable = async (req: Request, res: Response) => {
  maria.query("select * from testTable", function (err: any, rows: any) {
    if (!err) {
      console.log("secc");
      res.send(rows);
    } else {
      console.log("err: ", err);
    }
  });
};

const Test = {
  getTestTable: [getTestTable],
};

export default Test;
