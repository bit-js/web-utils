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

export function escapeBase64Char(char: string): string {
    // eslint-disable-next-line
    return base64map[char.charCodeAt(0)]!;
}

export function base64url(buffer: Uint8Array): string {
    return btoa(String.fromCharCode(...buffer)).replace(/[+/=]/g, escapeBase64Char);
}

const encoder = new TextEncoder();
export function text(str: string) {
    return encoder.encode(str);
}
