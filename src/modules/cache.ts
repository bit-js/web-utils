/**
 * Cache control options
 */
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

/**
 * Parse options to `Cache-Control` header value
 */
export function control(options?: ControlOptions): string {
    if (typeof options === 'undefined')
        return 'public,max-age=604800';

    const parts: string[] = [];

    if (typeof options.maxAge === 'number')
        parts.push(`max-age=${options.maxAge}`);
    if (typeof options.sMaxAge === 'number')
        parts.push(`s-maxage=${options.sMaxAge}`);

    if (options.noCache === true)
        parts.push('no-cache');
    if (options.noStore === true)
        parts.push('no-store');
    if (options.noTransform === true)
        parts.push('no-transform');

    if (options.mustRevalidate === true)
        parts.push('must-revalidate');
    if (options.proxyRevalidate === true)
        parts.push('proxy-revalidate');

    if (options.mustUnderstand === true)
        parts.push('must-understand');

    if (options.staleWhileRevalidate === true)
        parts.push('stale-while-revalidate');
    if (options.staleIfError === true)
        parts.push('stale-if-error');

    if (options.private === true)
        parts.push('private');
    if (options.public === true)
        parts.push('public');
    if (options.immutable === true)
        parts.push('immutable');

    if (typeof options.minFresh === 'number')
        parts.push(`min-fresh=${options.minFresh}`);
    if (options.onlyIfCached === true)
        parts.push('only-if-cached');

    return parts.join(', ');
}
