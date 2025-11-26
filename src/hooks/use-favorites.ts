import { useMemo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './index';
import { Offer } from '../types/offer';
import { AuthorizationStatus } from '../const';
import { AppRoute } from '../app/routes';
import { selectAuthorizationStatus } from '../store/user/user-selectors';
import { changeFavoriteStatusAction } from '../store/favorites/favorites-thunks';

export function useFavoriteAction(offerId: string, isFavorite: boolean) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authorizationStatus = useAppSelector(selectAuthorizationStatus);
  const [isFavoriteSubmitting, setIsFavoriteSubmitting] = useState(false);

  const handleFavoriteClick = useCallback(() => {
    if (authorizationStatus !== AuthorizationStatus.Auth) {
      navigate(AppRoute.Login);
      return;
    }

    if (isFavoriteSubmitting) {
      return;
    }

    setIsFavoriteSubmitting(true);

    dispatch(changeFavoriteStatusAction({
      offerId,
      status: isFavorite ? 0 : 1
    })).finally(() => {
      setIsFavoriteSubmitting(false);
    });
  }, [authorizationStatus, dispatch, isFavorite, navigate, offerId, isFavoriteSubmitting]);

  return { handleFavoriteClick, isFavoriteSubmitting };
}

export function useFavorites(offers: Offer[]) {
  const favoritesByCity = useMemo(() => offers.reduce<Record<string, Offer[]>>((acc, offer) => {
    const city = offer.city.name;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(offer);
    return acc;
  }, {}), [offers]);

  return { favoritesByCity };
}
