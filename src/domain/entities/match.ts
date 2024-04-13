import { Player } from './player';

export interface Match {
  id: string;
  players: Player[];
  randomWords: string[];
  userInputs: { [key: string]: string };
}
