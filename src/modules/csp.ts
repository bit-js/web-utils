export type SandboxValue = boolean |
    `allow-${'downloads' | 'forms' | 'modals' |
    'orientation-lock' | 'pointer-lock' |
    `popups${'' | '-to-escape-sandbox'}` |
    'presentation' | 'same-origin' |
    'scripts' | `top-navigation${'' | '-by-user-activation' | '-to-custom-protocols'}`
    }`;

export type SourceValue = string | string[];

export interface SourceDirectives {
    default?: SourceValue;

    child?: SourceValue;
    connect?: SourceValue;
    font?: SourceValue;
    image?: SourceValue;
    media?: SourceValue;
    object?: SourceValue;
    manifest?: SourceValue;
    worker?: SourceValue;

    script?: SourceValue;
    scriptAttribute?: SourceValue;
    scriptElement?: SourceValue;

    style?: SourceValue;
    styleAttribute?: SourceValue;
    styleElement?: SourceValue;
}

export interface CSPOptions {
    baseURI?: SourceValue;
    reportTo?: string;

    sandbox?: SandboxValue;
    upgradeInsecureRequests?: boolean;

    frameAncestors?: SourceValue;
    formAction?: SourceValue;

    sources?: SourceDirectives;
}

// Special source values
export const self = "'self'";
export const none = "'none'";

export function hash(value: string, algorithm?: string): string {
    return typeof algorithm === 'string' ? `'${algorithm}-${value}'` : `'nonce-${value}'`;
}

export const unsafeEval = "'unsafe-eval'";
export const wasmUnsafeEval = "'wasm-unsafe-eval'";
export const unsafeHashes = "'unsafe-hashes'";
export const unsafeInline = "'unsafe-inline'";

export const strictDynamic = "'strict-dynamic'";
export const reportSample = "'report-sample'";
export const inlineSpeculationRules = "'inline-speculation-rules'";

/**
 * Parse a CSP source value to string
 */
export function parseValue(value: SourceValue): string {
    return typeof value === 'string' ? value : value.join(' ');
}

/**
 * Parse CSP options to header values
 */
export function parse(options?: CSPOptions): string {
    if (typeof options === 'undefined') return "default-src 'self'";

    // Parts of the header
    const parts = [];

    if (typeof options.baseURI !== 'undefined')
        parts.push(`base-uri ${parseValue(options.baseURI)}`);
    if (typeof options.frameAncestors !== 'undefined')
        parts.push(`frame-ancestors ${parseValue(options.frameAncestors)}`);

    if (typeof options.reportTo === 'string')
        parts.push(`report-to ${options.reportTo}`);

    if (typeof options.sandbox !== 'undefined')
        parts.push(options.sandbox === true ? 'sandbox' : `sandbox '${options.sandbox}'`);

    if (options.upgradeInsecureRequests === true)
        parts.push('upgrade-insecure-requests');

    const { sources } = options;
    if (typeof sources === 'object') {
        if (typeof sources.default !== 'undefined')
            parts.push(`default-src ${parseValue(sources.default)}`);

        if (typeof sources.child !== 'undefined')
            parts.push(`child-src ${parseValue(sources.child)}`);
        if (typeof sources.connect !== 'undefined')
            parts.push(`connect-src ${parseValue(sources.connect)}`);
        if (typeof sources.font !== 'undefined')
            parts.push(`font-src ${parseValue(sources.font)}`);
        if (typeof sources.image !== 'undefined')
            parts.push(`img-src ${parseValue(sources.image)}`);
        if (typeof sources.media !== 'undefined')
            parts.push(`media-src ${parseValue(sources.media)}`);
        if (typeof sources.object !== 'undefined')
            parts.push(`object-src ${parseValue(sources.object)}`);
        if (typeof sources.manifest !== 'undefined')
            parts.push(`manifest-src ${parseValue(sources.manifest)}`);
        if (typeof sources.worker !== 'undefined')
            parts.push(`worker-src ${parseValue(sources.worker)}`);

        if (typeof sources.script !== 'undefined')
            parts.push(`script-src ${parseValue(sources.script)}`);
        if (typeof sources.scriptAttribute !== 'undefined')
            parts.push(`script-src-attr ${parseValue(sources.scriptAttribute)}`);
        if (typeof sources.scriptElement !== 'undefined')
            parts.push(`script-src-elem ${parseValue(sources.scriptElement)}`);

        if (typeof sources.style !== 'undefined')
            parts.push(`style-src ${parseValue(sources.style)}`);
        if (typeof sources.styleAttribute !== 'undefined')
            parts.push(`style-src-attr ${parseValue(sources.styleAttribute)}`);
        if (typeof sources.styleElement !== 'undefined')
            parts.push(`style-src-elem ${parseValue(sources.styleElement)}`);
    }

    return parts.join('; ');
}
