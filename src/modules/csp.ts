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

export interface Options {
    baseURI?: SourceValue;
    reportTo?: string;

    sandbox?: SandboxValue;
    upgradeInsecureRequests?: boolean;

    frameAncestors?: SourceValue;
    formAction?: SourceValue;

    sources?: SourceDirectives;
}

export function hash(value: string, algorithm?: string): string {
    return typeof algorithm === 'string' ? `'${algorithm}-${value}'` : `'nonce-${value}'`;
}

// Special source values
export const self = "'self'";
export const none = "'none'";

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
 * Parse CSP options to `Content-Security-Policy` header values
 */
export function parse(options?: Options): string {
    if (options === undefined) return "default-src 'self'";

    // Parts of the header
    const parts = [];

    if (options.baseURI !== undefined)
        parts.push(`base-uri ${parseValue(options.baseURI)}`);
    if (options.frameAncestors !== undefined)
        parts.push(`frame-ancestors ${parseValue(options.frameAncestors)}`);

    if (options.reportTo !== undefined)
        parts.push(`report-to ${options.reportTo}`);

    {
        const { sandbox } = options;
        if (sandbox !== undefined && sandbox !== false)
            parts.push(sandbox === true ? 'sandbox' : `sandbox '${sandbox}'`);
    }

    if (options.upgradeInsecureRequests === true)
        parts.push('upgrade-insecure-requests');

    const { sources } = options;
    if (sources !== undefined) {
        if (sources.default !== undefined)
            parts.push(`default-src ${parseValue(sources.default)}`);

        if (sources.child !== undefined)
            parts.push(`child-src ${parseValue(sources.child)}`);
        if (sources.connect !== undefined)
            parts.push(`connect-src ${parseValue(sources.connect)}`);
        if (sources.font !== undefined)
            parts.push(`font-src ${parseValue(sources.font)}`);
        if (sources.image !== undefined)
            parts.push(`img-src ${parseValue(sources.image)}`);
        if (sources.media !== undefined)
            parts.push(`media-src ${parseValue(sources.media)}`);
        if (sources.object !== undefined)
            parts.push(`object-src ${parseValue(sources.object)}`);
        if (sources.manifest !== undefined)
            parts.push(`manifest-src ${parseValue(sources.manifest)}`);
        if (sources.worker !== undefined)
            parts.push(`worker-src ${parseValue(sources.worker)}`);

        if (sources.script !== undefined)
            parts.push(`script-src ${parseValue(sources.script)}`);
        if (sources.scriptAttribute !== undefined)
            parts.push(`script-src-attr ${parseValue(sources.scriptAttribute)}`);
        if (sources.scriptElement !== undefined)
            parts.push(`script-src-elem ${parseValue(sources.scriptElement)}`);

        if (sources.style !== undefined)
            parts.push(`style-src ${parseValue(sources.style)}`);
        if (sources.styleAttribute !== undefined)
            parts.push(`style-src-attr ${parseValue(sources.styleAttribute)}`);
        if (sources.styleElement !== undefined)
            parts.push(`style-src-elem ${parseValue(sources.styleElement)}`);
    }

    return parts.join(';');
}
