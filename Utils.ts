import crypto from 'crypto';

export const createHashingString = (
  title: string,
  artist: string,
  album: string,
): string => `${title}:${artist}:${album}`;

export const getHash = (data: string): string => {
  const hash: crypto.Hash = crypto.createHash("sha256").update(data, "utf-8");
  return hash.digest("hex");
};
