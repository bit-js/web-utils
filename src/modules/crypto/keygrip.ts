import { textEncoder } from '../../constants';
import { escapeBase64Char } from '../encode';
import { algorithm, key, timingSafeEqual } from './hmac';

export class KeyGrip {
    readonly keys: CryptoKey[];
    readonly keyCount: number;

    readonly decoder: TextDecoder;
    readonly algorithm: HmacKeyGenParams;

    public constructor(keys: CryptoKey[], keyAlgorithm: HmacKeyGenParams, encoding: string) {
        this.keys = keys;
        this.keyCount = keys.length;

        this.decoder = new TextDecoder(encoding);
        this.algorithm = keyAlgorithm;
    }

    public async sign(data: BufferSource) {
        return this.signKey(data, 0);
    }

    public async verify(data: BufferSource, digest: BufferSource): Promise<boolean> {
        for (let i = 0, len = this.keyCount; i < len; ++i) {
            if (await timingSafeEqual(digest, textEncoder.encode(await this.signKey(data, i))))
                return true;
        }

        return false;
    }

    public async index(data: BufferSource, digest: BufferSource): Promise<number> {
        for (let i = 0, len = this.keyCount; i < len; ++i) {
            if (await timingSafeEqual(digest, textEncoder.encode(await this.signKey(data, i))))
                return i;
        }

        return -1;
    }

    // eslint-disable-next-line
    private async signKey(data: BufferSource, keyIdx: number) {
        return this.decoder.decode(await crypto.subtle.sign(this.algorithm, this.keys[keyIdx], data)).replace(/[+/=]/g, escapeBase64Char);
    }
}

export async function init(secrets: string[], keyAlgorithm?: string, encoding?: string) {
    const algo = algorithm(keyAlgorithm ?? 'sha1');

    const { length } = secrets;
    const keys = new Array<CryptoKey>(length);
    for (let i = 0; i < length; ++i) keys[i] = await key(textEncoder.encode(secrets[i]), algo);

    return new KeyGrip(keys, algo, encoding ?? 'base64');
}
