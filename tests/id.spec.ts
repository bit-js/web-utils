import { test, expect } from 'bun:test';
import { id } from '..';

test('ID generator', () => {
    const size = 25 + ((Math.random() * 1600) | 0);

    const gen = id.random(size);
    console.log(gen.toString());

    expect(gen().length).toBe(size);
});
