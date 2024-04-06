export type Generator = () => string;

export class UniqueGeneratorFactory {
    /**
     * The size of the map that stored strings with equal length
     */
    public readonly mapSize: number;

    /**
     * Max safe length to make an incremental id generator
     */
    public readonly safeLength: number;

    /**
     * Store strings with equal length
     */
    public readonly map: string[];

    /**
     * The number base
     */
    public readonly radix: number;

    /**
     * Required length for the item in the internal map
     */
    public readonly mapItemLength: number;

    /**
     * Create a non-secure id generator factory
     */
    public constructor(radix: number, mapItemLength: number) {
        const mapSize = radix ** mapItemLength;

        const map = new Array<string>(mapSize);
        for (let i = 0; i < mapSize; ++i) map[i] = (i + mapSize).toString(radix).substring(1);

        this.mapSize = mapSize;
        this.map = map;

        this.safeLength = Math.log2(Number.MAX_SAFE_INTEGER) / Math.log2(radix) >>> 0;

        this.radix = radix;
        this.mapItemLength = mapItemLength;
    }

    private createPadding(length: number): string[] {
        const { mapSize, map } = this;

        const padding = new Array<string>(mapSize);
        if (length === 1)
            // eslint-disable-next-line
            for (let i = 0; i < mapSize; ++i)
                // eslint-disable-next-line
                padding[i] = map[i][0];
        else
            // eslint-disable-next-line
            for (let i = 0; i < mapSize; ++i)
                // eslint-disable-next-line
                padding[i] = map[i].substring(0, length);

        return padding;
    }

    /**
     * Create a non-secure unique ID generator
     */
    public size(length: number): Generator {
        if (length <= this.safeLength) {
            const { radix } = this;

            const min = radix ** (length - 1);
            const limit = min * radix;

            return Function(`let i=-1;return ()=>{if(i===${limit - min - 1}){i=0;return "${min.toString(radix)}";}++i;return (${min}+i).toString(${radix});}`)();
        }

        const { mapItemLength, mapSize } = this;

        const paddingCount = (length / mapItemLength >>> 0) - 1;
        const paddingSize = length % mapItemLength;

        if (paddingSize === 0)
            return Function('h', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];return ()=>{if(j===${mapSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(this.map);

        return Function('h', 'h1', `'use strict';let s='';let j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];s+=h1[${mapSize}*Math.random()>>>0];return ()=>{if(j===${mapSize}){s='';j=1;for(let i=0;i<${paddingCount};++i)s+=h[${mapSize}*Math.random()>>>0];s+=h1[${mapSize}*Math.random()>>>0];return s+h[0];};return s+h[j++];}`)(this.map, this.createPadding(paddingSize));
    }
}

/**
 * Create a non-secure unique ID generator
 */
export const unique = new UniqueGeneratorFactory(16, 4);
