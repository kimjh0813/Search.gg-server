import { Request, Response } from "express";
import apiRequest from "../../utils/apiRequest";

import maria from "../../database/maria";

const apiKey = process.env.RIOT_API_KEY;

interface UserInfo {
  accountId: string;
  id: string;
  name: string;
  profileIconId: number;
  puuid: string;
  revisionDate: number;
  summonerLevel: number;
}

interface TierInfo {
  leagueId?: string;
  queueType: string;
  tier: string;
  rank?: string;
  summonerId?: string;
  summonerName?: string;
  leaguePoints?: number;
  wins?: number;
  losses?: number;
  veteran?: boolean;
  inactive?: boolean;
  freshBlood?: boolean;
  hotStreak?: boolean;
}

const getGameVersion = async (req: Request, res: Response) => {
  const response = await apiRequest<string[]>({
    url: "https://ddragon.leagueoflegends.com/api/versions.json",
    method: "get",
  });

  res.send(response.data[0]);
};

const getUserInfo = async (req: Request, res: Response) => {
  const response = await apiRequest<UserInfo>({
    url: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.username}`,
    method: "get",
    headers: {
      "X-Riot-Token": apiKey,
    },
  });
  console.log(response.data);

  res.send(response.data);
};

const getUserTier = async (req: Request, res: Response) => {
  const response = await apiRequest<TierInfo[]>({
    url: `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${req.params.id}`,
    method: "get",
    headers: {
      "X-Riot-Token": apiKey,
    },
  });

  let tierInfo = response.data;

  const rankValue = tierInfo.filter(
    ({ queueType }) => queueType === "RANKED_SOLO_5x5" || "RANKED_FLEX_SR"
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
