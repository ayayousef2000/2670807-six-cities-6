import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getToken, saveToken, dropToken } from './token';

const AUTH_TOKEN_KEY_NAME = 'six-cities-token';

describe('Service: Token', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'removeItem');
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save the token to localStorage', () => {
    const fakeToken = 'secret-token';

    saveToken(fakeToken);

    expect(localStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY_NAME, fakeToken);
    expect(localStorage.getItem(AUTH_TOKEN_KEY_NAME)).toBe(fakeToken);
  });

  it('should retrieve the token from localStorage', () => {
    const fakeToken = 'stored-token';
    localStorage.setItem(AUTH_TOKEN_KEY_NAME, fakeToken);

    const result = getToken();

    expect(localStorage.getItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY_NAME);
    expect(result).toBe(fakeToken);
  });

  it('should return an empty string if no token exists', () => {
    const result = getToken();
    expect(result).toBe('');
  });

  it('should remove the token from localStorage', () => {
    localStorage.setItem(AUTH_TOKEN_KEY_NAME, 'token-to-delete');

    dropToken();

    expect(localStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_KEY_NAME);
    expect(localStorage.getItem(AUTH_TOKEN_KEY_NAME)).toBeNull();
  });
});
