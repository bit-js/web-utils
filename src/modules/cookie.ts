/**
 * Cookie parser options
 */
export interface ParserOptions {
    decode?: (value: string) => string;
}

/**
 * Parse a cookie string
 */
export function parse(cookie: string): Record<string, string> {
    const pairs = cookie.split(';');
    const result: Record<string, string> = {};

    for (let i = 0, { length } = pairs; i < length; ++i) {
        const pair = pairs[i].split('=');
        result[pair[0].trim()] = pair.length === 1 ? '' : pair[1].trim();
    }

    return result;
}

/**
 * Create a cookie parser
 */
export function parser(options: ParserOptions): typeof parse {
    if (typeof options.decode === 'undefined')
        return parse;

    const { decode } = options;
    const defaultVal = decode('');

    // Cookie with value decode
    return (cookie) => {
        const pairs = cookie.split(';');
        const result: Record<string, string> = {};

        for (let i = 0, { length } = pairs; i < length; ++i) {
            const pair = pairs[i].split('=');
            result[pair[0].trim()] = pair.length === 1 ? defaultVal : decode(pair[1].trim());
        }

        return result;
    };
}

/**
 * SameSite value
 */
type SameSiteValue = 'strict' | 'lax' | 'none';
const sameSiteMap: Record<SameSiteValue, string> = {
    strict: 'Strict',
    lax: 'Lax',
    none: 'None'
};

/**
 * Cookie serializer options
 */
export interface SerializerOptions {
    encode?: (value: string) => string;

    domain?: string;
    expires?: Date;
    httpOnly?: boolean;
    maxAge?: number;
    partitioned?: boolean;
    path?: string;
    sameSite?: SameSiteValue;
    secure?: boolean;
}

/**
 * @internal Get serialized options
 */
function serializeOptions(options: SerializerOptions): string {
    const optionParts: string[] = [];

    if (typeof options.domain === 'string')
        optionParts.push(`Domain=${options.domain}`);
    if (options.expires instanceof Date)
        optionParts.push(`Expires=${options.expires.toUTCString()}`);
    if (options.httpOnly === true)
        optionParts.push('HttpOnly');
    if (typeof options.maxAge === 'number')
        optionParts.push(`Max-Age=${options.maxAge}`);
    if (options.partitioned === true)
        optionParts.push('Partitioned');
    if (typeof options.path === 'string')
        optionParts.push(`Path=${options.path}`);
    if (typeof options.sameSite === 'string')
        optionParts.push(`SameSite=${sameSiteMap[options.sameSite]}`);
    if (options.secure === true)
        optionParts.push('Secure');

    return optionParts.join(';');
}

/**
 * Serialize a cookie object
 */
export function serialize(cookie: Record<string, string | number | true>): string {
    const parts = [];

    for (const key in cookie) {
        const value = cookie[key];

        if (value === true) parts.push(key);
        else parts.push(`${key}=${value.toString()}`);
    }

    return parts.join(';');
}

/**
 * Create a cookie serializer
 */
export function serializer(options: SerializerOptions): typeof serialize {
    const { encode } = options;
    return Function('f', `return (c)=>{const p=[${JSON.stringify(serializeOptions(options))}];for(const k in c){const v=c[k];if(v===true)p.push(k);else p.push(\`\${k}=\${${typeof encode === 'function' ? 'f(v.toString())' : 'v.toString()'}};\`)}return p.join(';');}`)(encode);
}

// Cookie prototypes
export type CookieProtoTypes = 'string' | 'number' | 'bool';
export type CookieProtoTypesMap = {
    string: string,
    number: number,
    bool: boolean
};
export type CookieProto = Record<string, CookieProtoTypes>;

/**
 * Base cookie class
 */
export interface BaseCookie {
    /**
     * Return the `Set-Cookie` header value
     */
    readonly get: () => string;
}

/**
 * A cookie constructor
 */
export type CookieClass<T extends CookieProto> = new () => {
    [K in keyof T]?: CookieProtoTypesMap[T[K]]
} & BaseCookie;

/**
 * @internal Create string literal to return
 */
function createLiteral(resultLiteral: string[], setLiteral: string[]): string {
    if (resultLiteral.length === 0 && setLiteral.length === 1)
        return setLiteral[0];
    if (resultLiteral.length === 1 && setLiteral.length === 0)
        return JSON.stringify(resultLiteral[0]);

    // Wrap each set literal with ${}
    for (let i = 0, { length } = setLiteral; i < length; ++i) resultLiteral.push(`\${${setLiteral[i]}}`);
    return `\`${resultLiteral.join(';')}\``;
}

/**
 * Define a class to create and serialize cookie
 */
export function define<T extends CookieProto>(proto: T, options?: SerializerOptions): CookieClass<T> {
    const resultLiteral = [];
    const noOptions = typeof options === 'undefined';

    if (!noOptions) resultLiteral.push(serializeOptions(options));

    const setLiteral = [];
    const props = [];

    for (const key in proto) {
        props.push(key);
        const type = proto[key];

        // bool
        if (type.length === 4)
            setLiteral.push(`this.${key}===true?'${key}':''`);
        // string
        else if (type.charCodeAt(0) === 115)
            setLiteral.push(`typeof this.${key}==='string'?\`${key}=\${this.${key}}\`:''`);
        // number
        else
            setLiteral.push(`typeof this.${key}==='number'?\`${key}=\${this.${key}.toString()}\`:''`);
    }

    props.push(`get(){return ${createLiteral(resultLiteral, setLiteral)}}`);
    return Function(`'use strict';return class A{${props.join(';')}};`)();
}
