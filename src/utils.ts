import { textDecoder } from './constants';

export function bufferToBase64URL(buffer: BufferSource): string {
    return escapeBase64URL(btoa(textDecoder.decode(buffer)));
}

const base64map = [
    // eslint-disable-next-line
    null, null, null, null, null, null, null, null, null, null, null,
    // eslint-disable-next-line
    null, null, null, null, null, null, null, null, null, null, null,
    // eslint-disable-next-line
    null, null, null, null, null, null, null, null, null, null, null,
    // eslint-disable-next-line
    null, null, null, null, null, null, null, null, null, null, '-',
    // eslint-disable-next-line
    null, null, null, '_', null, null, null, null, null, null, null,
    // eslint-disable-next-line
    null, null, null, null, null, null, ''
];

function escapeBase64Char(char: string): string {
    // eslint-disable-next-line
    return base64map[char.charCodeAt(0)]!;
}

export function escapeBase64URL(str: string): string {
    return str.replace(/[+/=]/gu, escapeBase64Char);
}

// Return the original character except for '&', '<', '>', "'" and '"'
export const tagsMap = [
    // eslint-disable-next-line
    '\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07',
    // eslint-disable-next-line
    '\b', '\t', '\n', '\v', '\f', '\r', '\x0E', '\x0F', '\x10', '\x11',
    // eslint-disable-next-line
    '\x12', '\x13', '\x14', '\x15', '\x16', '\x17', '\x18', '\x19',
    // eslint-disable-next-line
    '\x1A', '\x1B', '\x1C', '\x1D', '\x1E', '\x1F',
    // eslint-disable-next-line
    ' ', '!', '&quot;', '#', '$', '%', '&amp;', '&#39;',
    // eslint-disable-next-line
    '(', ')', '*', '+', ',', '-', '.', '/', '0',
    // eslint-disable-next-line
    '1', '2', '3', '4', '5', '6', '7', '8', '9', ':',
    // eslint-disable-next-line
    ';', '&lt;', '=', '&gt;'
];

/**
 * Replace unescaped tags with the corresponding escaped characters
 */
function replaceTag(tagName: string): string {
    return tagsMap[tagName.charCodeAt(0)];
}

// Use the fastest implementation of specific runtimes
// eslint-disable-next-line
export const escapeHTML = globalThis.Bun?.escapeHTML ?? (
    (str: string): string => str.replace(/[&<>'"]/gu, replaceTag)
);
