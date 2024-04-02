import { group, run, bench } from 'mitata';
import nodeCrypto from 'node:crypto';

for (let i = 0; i < 15; ++i) bench('noop', () => { });

const len = 25 + Math.round(Math.random() * 100);

const store = new Uint8Array(len);

group('Crypto', () => {
    bench('Web', () => crypto.getRandomValues(store));
    bench('Node', () => nodeCrypto.randomBytes(len));
});

run();
