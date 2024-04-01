/**
 * Create a non-secure ID generator factory that uses `Math.random()`
 */
export function idFactory(radix: number, mapItemLength: number): (length: number) => () => string {
    if (radix < 2 || radix > 36) throw new Error(`Radix should be a value between 2 and 36, instead recieved: ${radix}`);

    const mapSize = radix ** mapItemLength;
    const randomMap = new Array<string>(mapSize);
    for (let i = 0; i < mapSize; ++i) randomMap[i] = (i + mapSize).toString(radix).substring(1);

    return (length) => {
        const limit = radix ** length;
        if (Number.isSafeInteger(limit)) {
            const min = radix ** (length - 1);
            return Function(`return ()=>(${min}+(Math.random()*${limit - min}>>0)).toString(${radix});`)();
        }

        if (length < mapItemLength) throw new Error(`Output length (${length}) should be larger or equal than ${mapItemLength}`);

        // eslint-disable-next-line
        const paddingCount = ((length / mapItemLength) >>> 0) - 1;
        const paddingSize = length % mapItemLength;

        if (paddingSize === 0)
            return Function('h', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];return ()=>{if(j===${mapSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(randomMap);

        const padding = new Array<string>(mapSize);
        // Slice the first {paddingSize} characters
        if (paddingSize === 1)
            // eslint-disable-next-line
            for (let i = 0; i < mapSize; ++i)
                // eslint-disable-next-line
                padding[i] = randomMap[i][0];
        else
            // eslint-disable-next-line
            for (let i = 0; i < mapSize; ++i)
                // eslint-disable-next-line
                padding[i] = randomMap[i].substring(0, paddingSize);

        // eslint-disable-next-line
        return Function('h', 'h1', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];s+=h1[${mapSize}*Math.random()>>>0];return ()=>{if(j===${mapSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];s+=h1[${mapSize}*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(randomMap, padding);
    };
}

/**
 * Create a non-secure ID generator that uses `Math.random()`
 */
export const id = idFactory(16, 4);
