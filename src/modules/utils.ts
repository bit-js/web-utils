/**
 * Left pad with no argument validation
 */
export function leftPad(str: string, len: number, ch: string): string {
    let payload = '';
    if (len < 1) return str;

    // eslint-disable-next-line
    while (true) {
        if ((len & 1) === 1)
            payload += ch;

        len >>= 1;
        if (len === 0) break;

        ch += ch;
    }

    return payload + str;
}
