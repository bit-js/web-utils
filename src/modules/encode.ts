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

function escape(char: string): string {
    // eslint-disable-next-line
    return base64map[char.charCodeAt(0)]!;
}

export function base64url(buffer: Uint8Array): string {
    return btoa(Array.from(buffer, String.fromCharCode).join('')).replace(/[+/=]/g, escape);
}
