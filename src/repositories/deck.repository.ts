import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Card, Deck, DeckRelations} from '../models';
import {CardRepository} from './card.repository';

export class DeckRepository extends DefaultCrudRepository<
  Deck,
  typeof Deck.prototype.deckId,
  DeckRelations
> {
  public readonly cards: HasManyRepositoryFactory<
    Card,
    typeof Deck.prototype.deckId
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CardRepository')
    protected cardRepositoryGetter: Getter<CardRepository>,
  ) {
    super(Deck, dataSource);
    this.cards = this.createHasManyRepositoryFactoryFor(
      'cards',
      cardRepositoryGetter,
    );
    this.registerInclusionResolver('cards', this.cards.inclusionResolver);
  }
}
