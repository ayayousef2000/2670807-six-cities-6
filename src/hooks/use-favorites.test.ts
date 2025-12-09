import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { useFavoriteAction, useFavorites } from './use-favorites';
import { AppRoute } from '../app/routes';
import { AuthorizationStatus } from '../const';
import { makeFakeOffer } from '../utils/mocks';
import * as ReduxHooks from './index';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../store/favorites/favorites-thunks', () => ({
  changeFavoriteStatusAction: vi.fn((payload: { offerId: string; status: number }) => ({
    type: 'favorites/changeStatus',
    payload,
  })),
}));

vi.mock('./index', () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

describe('Hook: useFavorites', () => {
  it('should group offers by city', () => {
    const offer1 = makeFakeOffer();
    offer1.city.name = 'Paris';
    const offer2 = makeFakeOffer();
    offer2.city.name = 'Paris';
    const offer3 = makeFakeOffer();
    offer3.city.name = 'Berlin';

    const { result } = renderHook(() => useFavorites([offer1, offer2, offer3]));
    const { favoritesByCity } = result.current;

    expect(Object.keys(favoritesByCity)).toHaveLength(2);
    expect(favoritesByCity['Paris']).toHaveLength(2);
    expect(favoritesByCity['Berlin']).toHaveLength(1);
    expect(favoritesByCity['Paris']).toEqual([offer1, offer2]);
  });

  it('should return empty object if no offers provided', () => {
    const { result } = renderHook(() => useFavorites([]));
    expect(result.current.favoritesByCity).toEqual({});
  });
});

describe('Hook: useFavoriteAction', () => {
  const mockDispatch = vi.fn(() => Promise.resolve());

  beforeEach(() => {
    vi.clearAllMocks();
    (ReduxHooks.useAppDispatch as Mock).mockReturnValue(mockDispatch);
  });

  it('should redirect to Login if user is not authorized', () => {
    (ReduxHooks.useAppSelector as Mock).mockReturnValue(AuthorizationStatus.NoAuth);

    const { result } = renderHook(() => useFavoriteAction('offer-1', false));

    act(() => {
      result.current.handleFavoriteClick();
    });

    expect(mockNavigate).toHaveBeenCalledWith(AppRoute.Login);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch "changeFavoriteStatusAction" with status 1 if not favorite', async () => {
    (ReduxHooks.useAppSelector as Mock).mockReturnValue(AuthorizationStatus.Auth);
    const mockId = 'offer-123';

    const { result } = renderHook(() =>
      useFavoriteAction(mockId, false)
    );

    act(() => {
      result.current.handleFavoriteClick();
    });

    expect(result.current.isFavoriteSubmitting).toBe(true);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'favorites/changeStatus',
          payload: { offerId: mockId, status: 1 },
        })
      );
      expect(result.current.isFavoriteSubmitting).toBe(false);
    });
  });

  it('should dispatch "changeFavoriteStatusAction" with status 0 if favorite', async () => {
    (ReduxHooks.useAppSelector as Mock).mockReturnValue(AuthorizationStatus.Auth);
    const mockId = 'offer-456';

    const { result } = renderHook(() =>
      useFavoriteAction(mockId, true)
    );

    act(() => {
      result.current.handleFavoriteClick();
    });

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: { offerId: mockId, status: 0 },
        })
      );
    });
  });
});
