import { group, run, bench } from 'mitata';

import { uid } from 'uid';
import hexoid from 'hexoid';
import { id } from '..';
import { nanoid } from 'nanoid/non-secure';

for (let i = 0; i < 15; ++i) bench('noop', () => { });
group('Generate 1e7 id of size 32', () => {
    bench('UID', () => {
        for (let i = 0; i < 1e7; ++i) uid(32);
    });

    bench('Non-secure nanoid', () => {
        for (let i = 0; i < 1e7; ++i) nanoid(32);
    });

    const genHexoid = hexoid(32);
    bench('Hexoid', () => {
        for (let i = 0; i < 1e7; ++i) genHexoid(32);
    });

    const genID = id.random(32);
    bench('ID', () => {
        for (let i = 0; i < 1e7; ++i) genID(32);
    });
})

run();
