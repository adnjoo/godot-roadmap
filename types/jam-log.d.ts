export interface Jam {
  id: string; // uuid
  name: string; // required
  startDate?: string; // ISO date string (YYYY-MM-DD)
  endDate?: string; // ISO date string (YYYY-MM-DD)
  jamUrl?: string;
  gameUrl?: string;
  notes?: string;
}
