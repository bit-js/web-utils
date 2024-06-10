import { escapeHTML } from '../utils.ts';

/* eslint-disable */
export function render({ raw }: TemplateStringsArray, ...args: any[]): string {
  let result = '';
  const { length } = args;

  for (let i = 0; i < length; ++i) {
    const val = args[i];
    const prevString = raw[i];
    const lastIdx = prevString.length - 1;

    result += prevString.charCodeAt(lastIdx) === 33
      ? `${prevString.substring(0, lastIdx)}${val === undefined || val === null ? '' : typeof val === 'string' ? val : Array.isArray(val) ? val.join('') : val + ''}`
      : `${prevString}${val === undefined || val === null ? '' : typeof val === 'string' ? escapeHTML(val) : Array.isArray(val) ? escapeHTML(val.join('')) : val + ''}`;
  }

  return result + raw[length];
}
