/**
 * Create a non-secure ID generator that uses `Math.random()`
 */
export function randomizer(len: number, base: number = 36): () => string {
    // The hex map for appending
    const hexSize = base * base;
    const hexMap = new Array<string>(hexSize);
    for (let i = 0; i < hexSize; ++i) hexMap[i] = (i + hexSize).toString(base);

    // hex string len
    const hexLen = hexMap[0].length;
    if (len < hexLen) throw new Error(`Hex map length (${hexLen}) is larger than requested length (${len})`);

    // Reset the store
    // eslint-disable-next-line
    const exceeded = len % hexLen;

    // eslint-disable-next-line
    return Function('h', `'use strict';let s='';let j=1;for(let i=0;i<${((len / hexLen) | 0) - 1};++i)s+=h[${hexSize}*Math.random()|0];${exceeded === 0 ? '' : `s+=h[${hexSize}*Math.random()|0].substring(0,${exceeded});`}return ()=>{if(j===${hexSize}){s='';j=1;for(let i=0;i<${((len / hexLen) | 0) - 1};++i)s+=h[${hexSize}*Math.random()|0];${exceeded === 0 ? '' : `s+=h[${hexSize}*Math.random()|0].substring(0,${exceeded});`}return s+h[0];};return s+h[j++];}`)(hexMap);
}
