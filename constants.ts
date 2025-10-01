
import { Item, Tiers } from './types';

export const TIERS: Tiers = {
  S: { name: 'S (God Tier)', color: 'bg-red-600' },
  A: { name: 'A (Amazing)', color: 'bg-orange-500' },
  B: { name: 'B (Great)', color: 'bg-yellow-400' },
  C: { name: 'C (Good)', color: 'bg-green-500' },
  D: { name: 'D (Decent)', color: 'bg-blue-500' },
  F: { name: 'F (Trash)', color: 'bg-gray-700' },
};

// Initial items are now fetched from the backend. Keep an empty array as default.
export const INITIAL_ITEMS: Item[] = [];
