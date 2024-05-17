const keyUsages = ['sign', 'verify'] as const;

export type HmacAlgorithm = Parameters<typeof crypto.subtle.importKey>[2];

// eslint-disable-next-line
export function key(key: BufferSource, keyAlgorithm: HmacKeyGenParams): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', key, keyAlgorithm, false, keyUsages);
}

export function algorithm<T extends HmacAlgorithm>(algorithm: T) {
    return {
        name: 'HMAC',
        hash: algorithm
    } satisfies HmacKeyGenParams;
}

// eslint-disable-next-line
export function sign(key: CryptoKey, value: BufferSource): Promise<ArrayBuffer> {
    return crypto.subtle.sign('HMAC', key, value);
}

// eslint-disable-next-line
export function verify(key: CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean> {
    return crypto.subtle.verify('HMAC', key, signature, data);
}

const timingAlgorithm = algorithm('SHA-256');
const timingKey = await crypto.subtle.generateKey(timingAlgorithm, false, keyUsages) as CryptoKey;

export async function timingSafeEqual(buf: BufferSource, anotherBuf: BufferSource): Promise<boolean> {
    // eslint-disable-next-line
    return await crypto.subtle.verify(timingAlgorithm, timingKey, await crypto.subtle.sign(timingAlgorithm, timingKey, buf), anotherBuf);
}
