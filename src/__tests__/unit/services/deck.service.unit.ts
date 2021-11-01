import {expect} from '@loopback/testlab';
import {DeckType} from '../../../models';
import {CardRepository, DeckRepository} from '../../../repositories';
import DeckService from '../../../services/deck.service';
import {givenDeck} from '../../helpers';

describe('DeckService', () => {
  let deckService: DeckService;
  const fullDeckSize = 52;
  const shorDeckSize = 36;

  before(async () => {
    deckService = new DeckService({} as DeckRepository, {} as CardRepository);
  });

  describe('Deck cards generate', () => {
    it('Check full deck size', () => {
      const deck = givenDeck();
      deck.cards = deckService.generateDeckCards(deck);
      expect(deck.cards.length).to.deepEqual(fullDeckSize);
    });

    it('Check short deck size', () => {
      const deck = givenDeck({type: DeckType.SHORT});
      deck.cards = deckService.generateDeckCards(deck);
      expect(deck.cards.length).to.deepEqual(shorDeckSize);
    });
  });
});
