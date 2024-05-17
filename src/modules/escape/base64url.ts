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

export default function base64url(str: string): string {
    return str.replace(/[+/=]/g, escapeBase64Char);
}
