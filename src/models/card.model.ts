import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Deck} from './deck.model';

export enum Suits {
  SPADES = 'SPADES',
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
  HEARTS = 'HEARTS',
}

@model()
export class Card extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(Suits),
    },
  })
  suit: string;

  @property({
    type: 'string',
    required: true,
  })
  code: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'number',
    required: false,
  })
  order: number;

  @belongsTo(() => Deck)
  deckId: string;

  constructor(data?: Partial<Card>) {
    super(data);
  }
}

export interface CardRelations {
  // describe navigational properties here
}

export type CardWithRelations = Card & CardRelations;
