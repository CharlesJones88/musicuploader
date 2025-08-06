export const basePath = '/mnt/md0/public/Music';
export const DB_FILE = '/mnt/md0/public/songs.db';

export type Song = {
  hash: string;
  title: string;
  artist: string;
  album: string;
};
