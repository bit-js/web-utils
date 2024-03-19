import { group, run, bench } from 'mitata';

import { uid } from 'uid';
import hexoid from 'hexoid';
import { create } from '../..';
import { nanoid } from 'nanoid/non-secure';

import { optimizeNextInvocation } from 'bun:jsc';

for (let i = 0; i < 15; ++i) bench('noop', () => { });

const size = 1e6;

group(`Generate ${size} non-secure id of size 32`, () => {
    optimizeNextInvocation(uid);
    bench('UID', () => {
        for (let i = 0; i < size; ++i) uid(32);
    });

    optimizeNextInvocation(nanoid);
    bench('Non-secure nanoid', () => {
        for (let i = 0; i < size; ++i) nanoid(32);
    });

    const genHexoid = hexoid(32);
    optimizeNextInvocation(genHexoid);
    bench('Hexoid', () => {
        for (let i = 0; i < size; ++i) genHexoid();
    });

    const genID = create.id(32);
    optimizeNextInvocation(genID);
    bench('ID', () => {
        for (let i = 0; i < size; ++i) genID();
    });
})

run();
