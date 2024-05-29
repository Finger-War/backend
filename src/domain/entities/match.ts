import { Player } from './player';

export interface Match {
  id: string;
  players: Record<string, Player>;
  randomWords: string[];
}
