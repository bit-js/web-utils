import { test, expect } from 'bun:test';
import { create } from '..';

test('ID generator', () => {
    const size = 8 + (Math.random() * 1600) | 0;

    const f = create.randomID(size);
    console.log(f.toString());

    expect(f().length).toBe(size);
});
