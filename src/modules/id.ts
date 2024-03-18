/**
 * Create a non-secure ID generator factory that uses `Math.random()`
 */
export function createBase(radix: number, mapItemLength: number): (length: number) => () => string {
    const mapSize = radix ** mapItemLength;
    const randomMap = new Array<string>(mapSize);
    for (let i = 0; i < mapSize; ++i) randomMap[i] = (i + mapSize).toString(radix).substring(1);

    return (length) => {
        if (length < mapItemLength) throw new Error(`Output length (${length}) should be larger or equal than ${mapItemLength}`);

        // eslint-disable-next-line
        const paddingCount = ((length / mapItemLength) >>> 0) - 1;
        const paddingSize = length % mapItemLength;

        if (paddingSize === 0)
            return Function('h', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];return ()=>{if(j===${mapSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(randomMap);

        const padding = new Array<string>(mapSize);
        for (let i = 0; i < mapSize; ++i) padding[i] = randomMap[i].substring(0, paddingSize);

        // eslint-disable-next-line
        return Function('h', 'h1', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];s+=h1[${mapSize}*Math.random()>>>0];return ()=>{if(j===${mapSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];s+=h1[${mapSize}*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(randomMap, padding);
    };
}

/**
 * Create a non-secure ID generator that uses `Math.random()`
 */
export const random = createBase(16, 2);
