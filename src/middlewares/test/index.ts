import maria from "../../database/maria";
import { Request, Response } from "express";

const getTestTable = async (req: Request, res: Response) => {
  // maria.query("select * from testTable", function (err: any, rows: any) {
  //   if (!err) {
  //     res.send(rows);
  //   } else {
  //     console.log("err: ", err);
  //   }
  // });
  res.send("response");
};

const Test = {
  getTestTable: [getTestTable],
};

export default Test;
