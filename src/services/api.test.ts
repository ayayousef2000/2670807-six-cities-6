import { describe, it, expect, vi, Mock } from 'vitest';
import axios, { InternalAxiosRequestConfig, AxiosHeaders } from 'axios';
import { createAPI } from './api';
import * as tokenService from './token';

vi.mock('axios');
vi.mock('./token');

describe('Service: API', () => {
  const createMockAxiosInstance = () => {
    const useMock = vi.fn();
    const instance = {
      interceptors: {
        request: {
          use: useMock,
        },
      },
    };
    return { instance, useMock };
  };

  it('should create axios instance with correct base configuration', () => {
    const { instance } = createMockAxiosInstance();
    (axios.create as Mock).mockReturnValue(instance);

    createAPI();

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://14.design.htmlacademy.pro/six-cities',
      timeout: 5000,
    });
  });

  it('should register a request interceptor', () => {
    const { instance, useMock } = createMockAxiosInstance();
    (axios.create as Mock).mockReturnValue(instance);

    createAPI();

    expect(useMock).toHaveBeenCalledTimes(1);
  });

  it('should attach the token to headers when a token exists', () => {
    const { instance, useMock } = createMockAxiosInstance();
    (axios.create as Mock).mockReturnValue(instance);

    const fakeToken = 'test-auth-token';
    (tokenService.getToken as Mock).mockReturnValue(fakeToken);

    createAPI();

    const [requestInterceptor] = useMock.mock.calls[0] as [(config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig];

    const mockConfig = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const resultConfig = requestInterceptor(mockConfig);

    expect(resultConfig.headers.get('X-Token')).toBe(fakeToken);
  });

  it('should not modify headers if no token exists', () => {
    const { instance, useMock } = createMockAxiosInstance();
    (axios.create as Mock).mockReturnValue(instance);

    (tokenService.getToken as Mock).mockReturnValue('');

    createAPI();

    const [requestInterceptor] = useMock.mock.calls[0] as [(config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig];

    const mockConfig = {
      headers: new AxiosHeaders(),
    } as InternalAxiosRequestConfig;

    const resultConfig = requestInterceptor(mockConfig);

    expect(resultConfig.headers.get('X-Token')).toBeUndefined();
  });
});
