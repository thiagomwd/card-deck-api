import {CardResponse} from './card.response';

export class DeckResponse {
  deckId: string;
  type: string;
  shuffled: boolean;
  remaining: number;
  cards?: CardResponse[];
}
