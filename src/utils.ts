import { textDecoder } from './constants';

/* eslint-disable */
export type Value = string | number | boolean | null | undefined;

export function bufferToBase64URL(buffer: BufferSource): string {
    return escapeBase64URL(btoa(textDecoder.decode(buffer)));
}

const base64map: string[] = [];
base64map[43] = '-';
base64map[47] = '_';
base64map[61] = '';

function escapeBase64Char(char: string): string {
    return base64map[char.charCodeAt(0)];
}

export function escapeBase64URL(str: string): string {
    return str.replace(/[+/=]/gu, escapeBase64Char);
}

const tagsMap: string[] = [];
tagsMap[34] = '&quot;';
tagsMap[38] = '&amp;';
tagsMap[39] = '&#39';
tagsMap[60] = '&lt;';
tagsMap[62] = '&gt;';

/**
 * Replace unescaped tags with the corresponding escaped characters
 */
function replaceTag(tagName: string): string {
    return tagsMap[tagName.charCodeAt(0)];
}

export const escapeHTML = globalThis.Bun?.escapeHTML ?? (
    (str: string): string => str.replace(/[&<>'"]/gu, replaceTag)
);

/**
 * Render GHTML templates
 */
export function html({ raw }: TemplateStringsArray, ...args: (Value | Value[])[]): string {
    let result = '';
    const { length } = args;

    for (let i = 0; i < length; ++i) {
        const val = args[i];
        const prevString = raw[i];

        result += prevString.charCodeAt(prevString.length - 1) === 33
            ? `${prevString.substring(0, prevString.length - 1)}${val === undefined || val === null ? '' : typeof val === 'string' ? val : Array.isArray(val) ? val.join('') : val}`
            : `${prevString}${val === undefined || val === null ? '' : typeof val === 'string' ? escapeHTML(val) : Array.isArray(val) ? escapeHTML(val.join('')) : val}`;
    }

    return result + raw[length];
}

