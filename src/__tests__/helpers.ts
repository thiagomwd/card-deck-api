import {uuid} from 'uuidv4';
import {Deck, DeckType} from '../models';

/**
 * Generate a complete Deck object for use with tests.
 * @param deck - A partial (or complete) Todo object.
 */
export function givenDeck(deck?: Partial<Deck>) {
  const data = Object.assign(
    {
      id: uuid(),
      type: DeckType.FULL,
      shuffled: true,
    },
    deck,
  );
  return new Deck(data);
}
