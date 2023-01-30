import { Request, Response } from "express";
import apiRequest from "../../utils/apiRequest";

import maria from "../../database/maria";

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

const getUserTier = async (req: Request, res: Response) => {
  const response = await apiRequest<any>({
    url: `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${req.params.id}`,
    method: "get",
    headers: {
      "X-Riot-Token": apiKey,
    },
  });

  let tierInfo = response.data;

  const rankValue = tierInfo.filter(
    ({ queueType }: any) => queueType === "RANKED_SOLO_5x5" || "RANKED_FLEX_SR"
  );

  if (tierInfo.length === 0 || !rankValue) {
    tierInfo = [
      { queueType: "RANKED_SOLO_5x5", tier: "unRanked" },
      { queueType: "RANKED_FLEX_SR", tier: "unRanked" },
    ];

    res.send(tierInfo);
  }

  if (rankValue.length === 1) {
    const queueTypeText =
      rankValue[0].queueType === "RANKED_SOLO_5x5"
        ? "RANKED_FLEX_SR"
        : "RANKED_SOLO_5x5";
    tierInfo = [{ queueType: queueTypeText, tier: "unRanked" }].concat(
      rankValue
    );
  }

  res.send(tierInfo);
};

const getUserGameRecord = async (req: Request, res: Response) => {
  const { startTime, endTime, queue, type, start, count } = req.query;

  const setQuery = () => {
    let query: string = "";
    if (startTime) {
      query = query + "startTime=" + startTime + "&";
    }
    if (endTime) {
      query = query + "endTime=" + endTime + "&";
    }
    if (queue) {
      query = query + "queue=" + queue + "&";
    }
    if (type) {
      query = query + "type=" + type + "&";
    }
    if (!start) {
      query = query + "start=" + "1" + "&";
    } else {
      query = query + "start=" + start + "&";
    }
    if (!count) {
      query = query + "start=" + "20";
    } else {
      query = query + "count=" + count;
    }

    return query;
  };

  console.log(setQuery());

  const response = await apiRequest<any>({
    url: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${
      req.params.puuid
    }/ids?${setQuery()}`,
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
  getUserTier: [getUserTier],
  getUserGameRecord: [getUserGameRecord],
};

export default Lol;
