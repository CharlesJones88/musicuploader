import { createHash } from 'crypto';

export const createHashingString = (
  title?: string,
  artist?: string,
  album?: string,
) => [title, artist, album].filter(item => item != void 0).join(':');

export const getHash = (data: string) => {
  return createHash('sha256').update(data, 'utf-8').digest('hex');
};
