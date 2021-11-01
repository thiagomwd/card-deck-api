import {service} from '@loopback/core';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {Card} from '../models';
import DeckService from '../services/deck.service';
import {CardsResponse} from './responses/cards.response';

export class DeckCardController {
  constructor(@service() private deckService: DeckService) {}

  @get('/decks/{deckId}/draw', {
    responses: {
      '200': {
        description: 'Array of Deck has many Card',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              title: 'Cards of a Deck',
              properties: {
                cards: {
                  type: 'array',
                  title: 'Cards',
                  items: getModelSchemaRef(Card, {
                    title: 'Card',
                    exclude: ['id', 'deckId', 'order'],
                  }),
                },
              },
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('deckId') deckId: string,
    @param.query.number('count') count: number,
  ): Promise<CardsResponse> {
    return this.getCardsResponse(
      await this.deckService.drawCard(deckId, count),
    );
  }

  private getCardsResponse(cards: Card[]): CardsResponse {
    return {
      cards: cards.map(card => {
        const {value, suit, code} = card;
        return {
          value,
          suit,
          code,
        };
      }),
    };
  }
}
