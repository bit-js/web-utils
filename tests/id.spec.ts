import { test, expect } from 'bun:test';
import { id } from '..';

test('ID generator', () => {
    const size = 8 + (Math.random() * 16) >>> 0;

    const f = id.unique.size(size);
    console.log(f.toString());

    expect(f().length).toBe(size);
});
