export const basePath: string = "/mnt/md0/public/Music";
export const DB_FILE: string = "./songs.db";

export type Song = {
  hash: string;
  title: string;
  artist: string;
  album: string;
};
