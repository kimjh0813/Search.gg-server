import maria from "../../database/maria";
import apiRequest from "../../utils/apiRequest";
import { Request, Response } from "express";

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
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

interface TierNoData {
  queueType: string;
  tier: string;
}

const getGameVersion = async (req: Request, res: Response) => {
  const response = await apiRequest<string[]>({
    url: "http://ddragon.leagueoflegends.com/api/versions.json",
    method: "get",
  });

  res.send(response.data[0]);
};

const getUserInfo = async (req: Request, res: Response) => {
  if (req.params.username.length < 2) {
    console.log(req.params.username.length);
    res.send("존재하지 않는 유저입니다.");
  }

  const response = await apiRequest<UserInfo>({
    url: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.params.username}`,
    method: "get",
    headers: {
      "X-Riot-Token": apiKey,
    },
  });

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

  let tierInfo: (TierNoData | TierInfo)[] = response.data;

  const rankValue = tierInfo.filter(
    ({ queueType }) => queueType === "RANKED_SOLO_5x5" || "RANKED_FLEX_SR"
  );

  if (tierInfo.length === 0 || !rankValue) {
    tierInfo = [
      { queueType: "RANKED_SOLO_5x5", tier: "UnRanked" },
      { queueType: "RANKED_FLEX_SR", tier: "UnRanked" },
    ];

    res.send(tierInfo);
  }

  if (rankValue.length === 1) {
    const queueTypeText =
      rankValue[0].queueType === "RANKED_SOLO_5x5"
        ? "RANKED_FLEX_SR"
        : "RANKED_SOLO_5x5";
    tierInfo = [{ queueType: queueTypeText, tier: "UnRanked" }].concat(
      rankValue
    );
  }

  if (tierInfo[0].queueType === "RANKED_FLEX_SR") {
    tierInfo = [tierInfo[1], tierInfo[0]];
  }

  res.send(tierInfo);
};

const getUserGameRecord = async (req: Request, res: Response) => {
  const queryType = ["startTime", "endTime", "queue", "type", "start", "count"];

  const setQuery = () => {
    let query: string = "";

    for (const [key, value] of Object.entries(req.query)) {
      if (!queryType.includes(key)) continue;
      query += `${key}=${value}&`;
    }

    if (!req.query.start) {
      query += "start=1&";
    }
    if (!req.query.count) {
      query += "count=20";
    }

    return query;
  };

  const matchIdData = await apiRequest<string[]>({
    url: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${
      req.params.puuid
    }/ids?${setQuery()}`,
    method: "get",
    headers: {
      "X-Riot-Token": apiKey,
    },
  });

  const matchIdArr = matchIdData.data;

  let response: any = [];

  for (const value of matchIdArr) {
    const data = await apiRequest<any>({
      url: `https://asia.api.riotgames.com/lol/match/v5/matches/${value}`,
      method: "get",
      headers: {
        "X-Riot-Token": apiKey,
      },
    });
    if (!response) return;

    response.push(data.data);
  }

  res.send(response);
};

const Lol = {
  getGameVersion: [getGameVersion],
  getUserInfo: [getUserInfo],
  getUserTier: [getUserTier],
  getUserGameRecord: [getUserGameRecord],
};

export default Lol;
