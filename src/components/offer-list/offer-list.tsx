import { memo } from 'react';
import OfferCard from '../offer-card';
import { Offer } from '../../types/offer';

type ListVariant = 'cities' | 'near-places';

type OfferListProps = {
  offers: Offer[];
  variant?: ListVariant;
  onCardMouseEnter?: (offerId: string) => void;
  onCardMouseLeave?: () => void;
};

function OfferListComponent({
  offers,
  variant = 'cities',
  onCardMouseEnter,
  onCardMouseLeave
}: OfferListProps): JSX.Element {
  const listClassName =
    variant === 'cities'
      ? 'cities__places-list places__list tabs__content'
      : 'near-places__list places__list';

  return (
    <div className={listClassName}>
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          variant={variant}
          onMouseEnter={onCardMouseEnter}
          onMouseLeave={onCardMouseLeave}
        />
      ))}
    </div>
  );
}

const OfferList = memo(OfferListComponent);
export default OfferList;
