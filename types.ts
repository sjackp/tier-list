
export type Item = {
  id: string;
  content: string;
  link?: string | null;
  notes?: string | null;
  year?: number | null;
};

export type TierId = 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'unranked';

export type TierInfo = {
  name: string;
  color: string;
};

export type Tiers = Record<Exclude<TierId, 'unranked'>, TierInfo>;

export type TiersData = Record<TierId, Item[]>;
