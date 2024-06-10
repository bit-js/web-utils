import { textDecoder } from './constants';

/* eslint-disable */
export type Value = string | number | boolean | null | undefined;

export function bufferToBase64URL(buffer: BufferSource): string {
    return escapeBase64URL(btoa(textDecoder.decode(buffer)));
}

const base64map = [
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null, null, null, '-',
    null, null, null, '_', null, null, null, null, null, null, null,
    null, null, null, null, null, null, ''
];

function escapeBase64Char(char: string): string {
    return base64map[char.charCodeAt(0)]!;
}

export function escapeBase64URL(str: string): string {
    return str.replace(/[+/=]/gu, escapeBase64Char);
}

// Return the original character except for '&', '<', '>', "'" and '"'
const tagsMap = [
    '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    '\b', '\t', '\n', '\v', '\f', '\r', '\x0E', '\x0F', '\x10', '\x11',
    '\x12', '\x13', '\x14', '\x15', '\x16', '\x17', '\x18', '\x19',
    '\x1A', '\x1B', '\x1C', '\x1D', '\x1E', '\x1F',
    ' ', '!', '&quot;', '#', '$', '%', '&amp;', '&#39;',
    '(', ')', '*', '+', ',', '-', '.', '/', '0',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', ':',
    ';', '&lt;', '=', '&gt;'
];

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
