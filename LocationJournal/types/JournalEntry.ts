
export type JournalEntry = {
  id: string;
  photoUri: string;
  latitude: number;
  longitude: number;
  note: string;
  timestamp: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
