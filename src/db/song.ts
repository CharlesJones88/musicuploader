import { allAsync, getAsync, runAsync } from './db.ts';
import { Song } from '../Song.ts';
import { logger } from '../logger/index.ts';

export async function deleteSong(hash: string) {
  return await runAsync(`DELETE FROM songs WHERE hash = ?`, hash);
}

export async function insertSong(
  hash: string,
  title?: string,
  artist?: string,
  album?: string,
) {
  if (title == void 0) {
    throw new Error('Title not provided');
  }
  if (artist == void 0) {
    throw new Error('Artist not provided');
  }
  if (album == void 0) {
    throw new Error('Ablum not provided');
  }

  await runAsync(
    'INSERT OR IGNORE INTO songs (hash, title, artist, album) VALUES (?, ?, ?, ?)',
    hash,
    title,
    artist,
    album,
  );
}

export async function getSong(hash: string) {
  return await getAsync<Song>(
    `SELECT 
      hash, 
      title, 
      artist, 
      album 
    FROM songs 
    WHERE hash = ?`,
    hash,
  );
}

export async function getAllSongs() {
  return await allAsync<Song>('SELECT hash, title, artist, album FROM songs');
}

export async function getSongsByTitle(titles: Array<string>) {
  return await allAsync<Song>(
    `SELECT 
      hash, 
      title, 
      artist, 
      album 
    FROM songs
    WHERE title IN (${titles.map(() => '?').join(',')})`,
    ...titles,
  );
}

export async function getCount() {
  try {
    const { count } = await getAsync<{ count: number }>(
      `SELECT COUNT(*) AS 'count' FROM 'songs'`,
    ) ?? {};
    return count;
  } catch (error) {
    logger.error('Error getting song count', error);
    return;
  }
}
