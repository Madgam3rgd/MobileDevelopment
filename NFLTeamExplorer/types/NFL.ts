
export type Player = {
  id: string;
  name: string;
  position: string;
  number: number;
};

export type NFLTeam = {
  id: string;
  name: string;
  city: string;
  conference: 'AFC' | 'NFC';
  players: Player[];
};
