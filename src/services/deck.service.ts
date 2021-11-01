import {Filter, repository} from '@loopback/repository';
import {Card, Deck, DeckRelations, DeckType, Suits} from '../models';
import {CardRepository, DeckRepository} from '../repositories';
import {uuid} from '../utils';

export default class DeckService {
  private letterCards: string[] = ['ACE', 'JACK', 'QUEEN', 'KING'];

  constructor(
    @repository(DeckRepository)
    public deckRepository: DeckRepository,
    @repository(CardRepository)
    public cardRepository: CardRepository,
  ) {}

  /**
   * Generate cards to a new deck
   * @param deck
   * @returns
   */
  public generateDeckCards(deck: Deck): Card[] {
    let cards = this.getNumberCards();
    if (deck.type === DeckType.FULL) {
      const cloneLetterCards = [...this.letterCards];
      const ace = cloneLetterCards.shift();
      cards = [ace!, ...cards, ...cloneLetterCards];
    }
    return this.mapToCardModels(deck.deckId!, cards);
  }

  /**
   * Map a array of string cards to model Cards
   * @param cards
   * @returns
   */
  private mapToCardModels(deckId: string, cards: string[]): Card[] {
    const mappedCards: Card[] = [];
    let countOrder = 0;

    Object.values(Suits).forEach(suit => {
      [...cards].forEach(card => {
        mappedCards.push(
          new Card({
            id: uuid(),
            value: card,
            suit: suit,
            code: this.getCardCode(card, suit),
            deckId: deckId,
            order: countOrder,
          }),
        );
        countOrder++;
      });
    });

    return mappedCards;
  }

  private getCardCode(cardValue: string, suit: string) {
    const firstChar = isNaN(parseInt(cardValue)) ? cardValue[0] : cardValue;
    return `${firstChar}${suit[0]}`;
  }

  private getNumberCards(): string[] {
    return Array(9)
      .fill('')
      .map((e, i) => `${i + 2}`);
  }

  private sortCards(a: Card, b: Card) {
    if (a.order! < b.order!) {
      return -1;
    }
    if (a.order! > b.order!) {
      return 1;
    }
    return 0;
  }

  public async createNewDeck(deck: Deck): Promise<Deck> {
    deck.deckId = uuid();
    await this.deckRepository.create(deck);
    deck.cards = await this.cardRepository.createAll(
      this.generateDeckCards(deck),
    );
    return deck;
  }

  public async getById(
    deckId: string,
    filter?: Filter<Deck>,
  ): Promise<Deck & DeckRelations> {
    const deck = await this.deckRepository.findById(deckId, filter);
    if (!deck.shuffled) {
      deck.cards = deck.cards.sort(this.sortCards);
    }
    return deck;
  }

  public async drawCard(deckId: string, count: number): Promise<Card[]> {
    const cards = (
      await this.getById(deckId, {include: ['cards']})
    ).cards.splice(0, count);
    await this.deleteCards(cards);
    return cards;
  }

  /**
   * Delete cards by array of Card
   * @param cards
   * @returns
   */
  private async deleteCards(cards: Card[]): Promise<number> {
    let countDeleted = 0;
    for (const card of cards) {
      await this.cardRepository.delete(card);
      countDeleted++;
    }
    return countDeleted;
  }
}
