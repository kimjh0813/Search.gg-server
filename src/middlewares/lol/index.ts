import { Request, Response } from "express";
import apiRequest from "../../utils/apiRequest";

const maria = require("../../database/maria");

const getGameVersion = async (req: Request, res: Response) => {
  const response = await apiRequest<any>({
    url: "https://ddragon.leagueoflegends.com/api/versions.json",
    method: "get",
  });

  res.send(response.data);
};
const Lol = {
  getGameVersion: [getGameVersion],
};

export default Lol;
