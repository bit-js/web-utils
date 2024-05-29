export type Value = string | number | boolean | null | undefined;

export class Pair {
    public readonly key: string;
    public readonly value: Value;

    public domain?: string;
    public expires?: string;
    public httpOnly?: boolean;
    public maxAge?: number;
    public partitioned?: boolean;
    public path?: string;
    public secure?: boolean;
    public sameSite?: 'Strict' | 'Lax' | 'None';

    public constructor(key: string, value: Value) {
        this.key = key;
        this.value = value;
    }

    public get(): string {
        // eslint-disable-next-line
        return `${this.key}=${this.value}${typeof this.domain === 'string' ? `; Domain=${this.domain}` : ''}${typeof this.expires === 'string' ? `; Expires=${this.expires}` : ''}${this.httpOnly === true ? '; HttpOnly' : ''}${typeof this.maxAge === 'number' ? `; Max-Age=${this.maxAge}` : ''}${this.partitioned === true ? '; Partitioned' : ''}${typeof this.path === 'string' ? `; Path=${this.path}` : ''}${this.secure === true ? '; Secure' : ''}${typeof this.sameSite === 'string' ? `; SameSite=${this.sameSite}` : ''}`;
    }

    public attach(headers: Record<string, string>): void {
        attach(headers, this.get());
    }
}

/**
 * Create a cookie pair
 */
export function pair(key: string, value: string | number | boolean | null | undefined): Pair {
    return new Pair(key, value);
}

/**
 * Set the cookie value to a header object
 */
export function attach(headers: Record<string, string>, cookie: string): void {
    // eslint-disable-next-line
    headers['Set-Cookie'] = headers['Set-Cookie'] === undefined ? cookie : `${headers['Set-Cookie']}, ${cookie}`;
}

/**
 * Parse a cookie string
 */
export function parse(cookie: string): Record<string, string> {
    const result: Record<string, string> = {};
    const parts = cookie.split('; ');

    for (let i = 0, { length } = parts; i < length; ++i) {
        const part = parts[i];

        const sepIdx = part.indexOf('=');
        if (sepIdx === -1) return result;

        result[part.substring(0, sepIdx)] = part.substring(sepIdx + 1);
    }

    return result;
}
