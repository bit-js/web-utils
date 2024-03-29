const tagsReplaceMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
} as Record<string, string>;

function replaceTag(tagName: string): string {
    return tagsReplaceMap[tagName];
}

const escapeRegex = /[&<>'"]/g;

// Use best implementations of specific runtimes
// eslint-disable-next-line
export const escape: (str: string) => string = globalThis.Bun?.escapeHTML ?? ((str) => str.replace(escapeRegex, replaceTag));
