import { group, run, bench } from 'mitata';

import { uid } from 'uid';
import hexoid from 'hexoid';
import { create } from '../..';
import { nanoid } from 'nanoid/non-secure';

import { optimizeNextInvocation } from 'bun:jsc';

for (let i = 0; i < 15; ++i) bench('noop', () => { });

const cnt = 1e6, size = 8 + Math.round(Math.random() * 1296);

group(`Generate ${cnt} non-secure id of size ${size}`, () => {
    optimizeNextInvocation(uid);
    bench('UID', () => {
        for (let i = 0; i < cnt; ++i) uid(size);
    });

    optimizeNextInvocation(nanoid);
    bench('Non-secure nanoid', () => {
        for (let i = 0; i < cnt; ++i) nanoid(size);
    });

    const genHexoid = hexoid(size);
    optimizeNextInvocation(genHexoid);
    bench('Hexoid', () => {
        for (let i = 0; i < cnt; ++i) genHexoid();
    });

    const genID = create.randomID(size);
    optimizeNextInvocation(genID);
    bench('ID', () => {
        for (let i = 0; i < cnt; ++i) genID();
    });
})

run();
