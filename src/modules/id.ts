/**
 * Create a non-secure ID generator that uses `Math.random()`
 */
export function random(len: number): () => string {
    if (len < 2) throw new Error(`Cannot create a randomizer with length smaller than 2 (${len})`);

    // The hex map for appending
    const hexMap = new Array<string>(1296);
    // Generated string always have length 2
    for (let i = 0; i < 1296; ++i) hexMap[i] = (i + 1296).toString(36).substring(1);

    const paddingCount = (len >>> 1) - 1;
    if ((len & 1) === 0)
        return Function('h', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[1296*Math.random()>>>0];return ()=>{if(j===1296){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[1296*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(hexMap);

    const paddingHex = new Array<string>(1296);
    // eslint-disable-next-line
    for (let i = 0; i < 1296; ++i) paddingHex[i] = hexMap[i][0];

    // eslint-disable-next-line
    return Function('h', 'h1', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[1296*Math.random()>>>0];s+=h1[1296*Math.random()|0];return ()=>{if(j===1296){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[1296*Math.random()>>>0];s+=h1[1296*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(hexMap, paddingHex);
}
