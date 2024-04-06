# Web utils
A heavily-optimized web utility library.

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

## Cookie
Cookie utilities.
```ts
import { cookie } from '@bit-js/web-utils';
```

### Parser
To parse a cookie string:
```ts
// Record<string, string>
// Key with no associated value is set to an empty string in result
cookie.parse('id=1;name=A;'); // { id: '1', name: 'A' }
```

To create a custom parser:
```ts
// Create the parser 
const parse = cookie.parser(options);

// Use like above
parse(str);
```

Available options are:
```ts
export interface ParserOptions {
    decode?: (value: string) => string;
}
```

### Serializer
To serialize a cookie object to string:
```ts
cookie.serialize({ id: 1, name: 'A' }); // 'id=1;name=A;'
```

To create a custom serializer:
```ts
// Create the serializer
const serialize = cookie.serializer(options);

// Use like above
serialize(obj);
```

Available options are:
```ts
export interface SerializerOptions {
    encode?: (value: string) => string;

    domain?: string;
    httpOnly?: boolean;
    maxAge?: number;
    partitioned?: boolean;
    path?: string;
    sameSite?: SameSiteValue;
    secure?: boolean;
}
```

### Define
Define a cookie object constructor to set cookie values and serialize later.
```ts
// Define a class
const Cookie = cookie.define({
    id: 'number',
    name: 'string',
    darkMode: 'bool'
});

// Usage
const cookie = new Cookie();

// Set properties
cookie.id = 1;
cookie.name = 'A';
cookie.darkMode = true;

// Get the cookie string
// If a property is not set or set to false, it will not be included in final string
cookie.get(); // 'id=1;name=A;darkMode;'
```

This method accepts a `SerializerOptions` as the second parameter.

## HTML
HTML parsing utilities.
```ts
import { html } from '@bit-js/web-utils';
```

### Escaping
Escape HTML entities.
```ts
html.escape(str);
```

This uses `Bun.escapeHtml` if you are using Bun.

## ID generators
ID generator utilities.
```ts
import { id } from '@bit-js/web-utils';
```

### Non-secure ID
A fast non-secure ID generator using `Math.random()`.
```ts
// Specify string length
const f = id.unique.size(32);

// Generate a random ID of length 32
f();
```

This is an optimized version of [`hexoid`](//github.com/lukeed/hexoid) by [@lukeed](//github.com/lukeed).
