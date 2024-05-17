import { textDecoder } from '../constants';
import escapeBase64URL from './escape/base64url';

export function bufferToBase64URL(buffer: BufferSource): string {
    return escapeBase64URL(btoa(textDecoder.decode(buffer)));
}
