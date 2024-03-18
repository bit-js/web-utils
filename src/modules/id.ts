/**
 * Create a non-secure ID generator that uses `Math.random()`
 */
export function random(len: number, base: number = 36): () => string {
    // The hex map for appending
    const hexSize = base * base;
    const hexMap = new Array<string>(hexSize);
    for (let i = 0; i < hexSize; ++i) hexMap[i] = (i + hexSize).toString(base);

    // hex string len
    const hexLen = hexMap[0].length;
    if (len < hexLen) throw new Error(`Hex map length (${hexLen}) is larger than requested length (${len})`);

    const paddingMod = len % hexLen;
    const fillPadding = paddingMod === 0 ? '' : `s+=h1[${hexSize}*Math.random()|0];`;
    // eslint-disable-next-line
    const paddingCount = ((len / hexLen) | 0) - 1;

    // eslint-disable-next-line
    return Function('h', `'use strict';${paddingMod === 0 ? '' : `const h1=new Array(${hexSize});for(let i=0;i<${hexSize};++i)h1[i]=h[i].substring(0,${paddingMod});`}let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${hexSize}*Math.random()|0];${fillPadding}return ()=>{if(j===${hexSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${hexSize}*Math.random()|0];${fillPadding}return s+h[0];};return s+h[j++];}`)(hexMap);
}
