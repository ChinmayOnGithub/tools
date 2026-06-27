import { describe, it, expect } from 'vitest';
import { beautifyJSON, minifyJSON } from './utils';

describe('JSON formatter utilities', () => {
  it('formats JSON string successfully', () => {
    const raw = '{"a":1,"b":[2,3]}';
    const result = beautifyJSON(raw);
    expect(result.success).toBe(true);
    expect(result.output).toBe(JSON.stringify(JSON.parse(raw), null, 2));
  });

  it('minifies JSON string successfully', () => {
    const raw = `{
      "a": 1,
      "b": [2, 3]
    }`;
    const result = minifyJSON(raw);
    expect(result.success).toBe(true);
    expect(result.output).toBe('{"a":1,"b":[2,3]}');
  });

  it('catches invalid JSON errors and parses line/column info', () => {
    const bad = '{\n  "a": 1,\n  "b": [2, 3,\n}';
    const result = beautifyJSON(bad);
    expect(result.success).toBe(false);
    expect(result.line).toBeDefined();
  });
});
