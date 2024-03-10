# Web utils
A fast web utility library.

## CSP
`Content-Security-Policy` header parser.
```ts
import { csp } from '@bit-js/web-utils';

// Parse options to header value
csp.parse(options);

// No options
csp.parse(); // "default-src 'self'"
```

Available options are:
```ts
export interface Options {
    baseURI?: string | string[];
    reportTo?: string;

    sandbox?: string | true;
    upgradeInsecureRequests?: boolean;

    frameAncestors?: string | string[];
    formAction?: string | string[];

    sources?: {
        default?: string | string[];

        child?: string | string[];
        connect?: string | string[];
        font?: string | string[];
        image?: string | string[];
        media?: string | string[];
        object?: string | string[];
        manifest?: string | string[];
        worker?: string | string[];

        script?: string | string[];
        scriptAttribute?: string | string[];
        scriptElement?: string | string[];

        style?: string | string[];
        styleAttribute?: string | string[];
        styleElement?: string | string[];
    };
}
```

Special source values include:
- `csp.self`: `'self'`
- `csp.none`: `'none'`
- `csp.unsafeEval`: `'unsafe-eval'`
- `csp.wasmUnsafeEval`: `'wasm-unsafe-eval'`
- `csp.unsafeHashes`: `'unsafe-hashes'`
- `csp.unsafeInline`: `'unsafe-inline'`
- `csp.strictDynamic`: `'strict-dynamic'`
- `csp.reportSample`: `'report-sample'`
- `csp.inlineSpeculationRules`: `'inline-speculation-rules'`

## Cache

### Cache control
`Cache-Control` header parser.
```ts
import { cache } from '@bit-js/web-utils';

// Parse options to header value
cache.control(options);

// No options
cache.control(); // "public,max-age=604800"
```

Available options are:
```ts
export interface ControlOptions {
    maxAge?: number;
    sMaxAge?: number;

    noCache?: boolean;
    noStore?: boolean;
    noTransform?: boolean;

    mustRevalidate?: boolean;
    proxyRevalidate?: boolean;

    mustUnderstand?: boolean;

    staleWhileRevalidate?: boolean;
    staleIfError?: boolean;

    private?: boolean;
    public?: boolean;
    immutable?: boolean;

    minFresh?: number;
    onlyIfCached?: boolean;
}
```
