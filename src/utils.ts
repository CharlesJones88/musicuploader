import { crypto } from '@std/crypto';
import { encodeHex } from '@std/encoding/hex';

export const createHashingString = (
  title?: string,
  artist?: string,
  album?: string,
) => [title, artist, album].filter((item) => item != void 0).join(':');

export function getHash(data: string) {
  const hash = crypto.subtle.digestSync(
    'SHA-256',
    new TextEncoder().encode(data),
  );
  return encodeHex(hash);
}
