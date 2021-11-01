import {service} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Card, Deck} from '../models';
import DeckService from '../services/deck.service';
import {DeckResponse} from './responses/deck.response';

export class DeckController {
  constructor(@service() private deckService: DeckService) {}

  @post('/decks')
  @response(200, {
    description: 'Create a new Deck and generate cards s',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'New Deck',
          properties: {
            deckId: {type: 'string'},
            type: {type: 'string'},
            shuffled: {type: 'string'},
            remaining: {type: 'number'},
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Deck, {
            title: 'Request new deck',
          }),
        },
      },
    })
    deck: Omit<Deck, 'deckId'>,
  ): Promise<DeckResponse> {
    return this.getDeckResponse(await this.deckService.createNewDeck(deck));
  }

  @get('/decks/{deckId}/open')
  @response(200, {
    description: 'Deck model instance',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Open a Deck',
          properties: {
            deckId: {type: 'string'},
            type: {type: 'string'},
            shuffled: {type: 'string'},
            remaining: {type: 'number'},
            cards: {
              type: 'array',
              title: 'Cards',
              items: getModelSchemaRef(Card, {
                exclude: ['id', 'deckId', 'order'],
                title: 'Card',
              }),
            },
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('deckId') id: string,
  ): Promise<DeckResponse> {
    return this.getDeckWithCardsResponse(
      await this.deckService.getById(id, {include: ['cards']}),
    );
  }

  private getDeckResponse(deck: Deck): DeckResponse {
    const {deckId, type, shuffled} = deck;
    return Object.assign({} as DeckResponse, {
      deckId,
      type,
      shuffled,
      remaining: deck.cards?.length || 0,
    });
  }

  private getDeckWithCardsResponse(deck: Deck): DeckResponse {
    const deckResponse = this.getDeckResponse(deck);
    return {
      ...deckResponse,
      cards:
        deck.cards?.map(card => {
          const {value, suit, code} = card;
          return {
            value,
            suit,
            code,
          };
        }) ?? [],
    };
  }
}
