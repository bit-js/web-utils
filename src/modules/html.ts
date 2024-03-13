const tagsReplaceMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
} as Record<string, string>;

function replaceTag(tagName: string): string {
    return tagsReplaceMap[tagName] ?? tagName;
}

const escapeRegex = /[&<>"']/g;

// Use best implementations of specific runtimes
// eslint-disable-next-line
export const escape: (str: string) => string = globalThis.Bun?.escapeHTML ?? ((str) => str.replace(escapeRegex, replaceTag));

/**
 * HTML tagged template
 */
export function tag({ raw }: TemplateStringsArray, ...values: string[]): string {
    const { length } = values;
    if (length === 0) return raw[0];

    const parts: string[] = [];
    for (let i = 0; i < length; ++i) {
        const str = raw[i];

        // If no need for escaping
        const lastIdx = str.length - 1;

        if (str.charCodeAt(lastIdx) === 33) {
            parts.push(str.substring(0, lastIdx));
            parts.push(values[i]);
        } else {
            parts.push(str);
            parts.push(escape(values[i]));
        }
    }

    parts.push(raw[length]);
    return parts.join('');
}
