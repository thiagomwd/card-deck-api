import {Entity, hasMany, model, property} from '@loopback/repository';
import {Card} from './card.model';

export enum DeckType {
  FULL = 'FULL',
  SHORT = 'SHORT',
}

@model()
export class Deck extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
  })
  deckId?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: Object.values(DeckType),
    },
  })
  type: string;

  @property({
    type: 'boolean',
    required: true,
  })
  shuffled: boolean;

  @hasMany(() => Card)
  cards: Card[];

  constructor(data?: Partial<Deck>) {
    super(data);
  }
}

export interface DeckRelations {
  // describe navigational properties here
}

export type DeckWithRelations = Deck & DeckRelations;
