import { Request, Response } from "express";
import apiRequest from "../../utils/apiRequest";

const maria = require("../../database/maria");

const apiKey = process.env.RIOT_API_KEY;

const getGameVersion = async (req: Request, res: Response) => {
  const response = await apiRequest<any>({
    url: "https://ddragon.leagueoflegends.com/api/versions.json",
    method: "get",
  });

  res.send(response.data);
};

const getUserInfo = async (req: Request, res: Response) => {
  const response = await apiRequest<any>({
    url: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.username}`,
    method: "get",
    headers: {
      "X-Riot-Token": apiKey,
    },
  });

  res.send(response.data);
};

const Lol = {
  getGameVersion: [getGameVersion],
  getUserInfo: [getUserInfo],
};

export default Lol;
