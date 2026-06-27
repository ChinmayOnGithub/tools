import { describe, it, expect } from 'vitest';
import { convertCase } from './utils';

describe('Case Converter utilities', () => {
  const text = 'hello WORLD. this is an EXAMPLE.';

  it('converts to upper and lower case', () => {
    expect(convertCase(text, 'upper')).toBe('HELLO WORLD. THIS IS AN EXAMPLE.');
    expect(convertCase(text, 'lower')).toBe('hello world. this is an example.');
  });

  it('converts to Title Case and Sentence case', () => {
    expect(convertCase(text, 'title')).toBe('Hello World. This Is An Example.');
    expect(convertCase(text, 'sentence')).toBe('Hello world. This is an example.');
  });

  it('converts to camelCase and PascalCase', () => {
    expect(convertCase('hello_world', 'camel')).toBe('helloWorld');
    expect(convertCase('hello_world', 'pascal')).toBe('HelloWorld');
  });

  it('converts to snake_case, kebab-case, Train-Case, and dot.case', () => {
    expect(convertCase('helloWorld', 'snake')).toBe('hello_world');
    expect(convertCase('helloWorld', 'kebab')).toBe('hello-world');
    expect(convertCase('helloWorld', 'train')).toBe('Hello-World');
    expect(convertCase('helloWorld', 'dot')).toBe('hello.world');
  });
});
