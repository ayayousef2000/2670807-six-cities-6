import { describe, it, expect } from 'vitest';
import { getRatingWidth } from './common';

describe('Utility: getRatingWidth', () => {
  it('should convert integer rating to correct percentage string', () => {
    expect(getRatingWidth(0)).toBe('0%');
    expect(getRatingWidth(3)).toBe('60%');
    expect(getRatingWidth(5)).toBe('100%');
  });

  it('should round down floating point ratings correctly', () => {
    expect(getRatingWidth(4.4)).toBe('80%');
    expect(getRatingWidth(2.2)).toBe('40%');
  });

  it('should round up floating point ratings correctly', () => {
    expect(getRatingWidth(4.5)).toBe('100%');
    expect(getRatingWidth(2.6)).toBe('60%');
  });
});
