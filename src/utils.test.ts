import { describe, it, expect } from 'vitest';
import { truncate } from './utils';

describe('truncate utility', () => {
  it('should truncate text longer than the limit', () => {
    const text = "This is a long string that should be truncated";
    expect(truncate(text, 10)).toBe("This is a ...");
  });

  it('should not truncate text shorter than the limit', () => {
    const text = "Short";
    expect(truncate(text, 10)).toBe("Short");
  });

  it('should handle empty strings', () => {
    expect(truncate("", 10)).toBe("");
  });
});
