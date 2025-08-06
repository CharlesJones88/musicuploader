import { allAsync, getAsync, runAsync } from './db.js';
import { Song } from '../Song.js';

export const deleteSong = async (hash: string) =>
  await runAsync(`DELETE FROM songs WHERE hash = $hash`, { $hash: hash });

export const insertSong = async (
  hash: string,
  title?: string,
  artist?: string,
  album?: string,
): Promise<void> => {
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
    'INSERT OR IGNORE INTO songs (hash, title, artist, album) VALUES ($hash, $title, $artist, $album)',
    {
      $hash: hash,
      $title: title,
      $artist: artist,
      $album: album,
    },
  );
};

export const getSong = async (hash: string): Promise<Song> =>
  await getAsync<{ $hash: string }, Song>(
    `SELECT 
      hash, 
      title, 
      artist, 
      album 
    FROM songs 
    WHERE hash = $hash`,
    {
      $hash: hash,
    },
  );

export const getAllSongs = async (): Promise<Array<Song>> =>
  await allAsync<void, Song>('SELECT hash, title, artist, album FROM songs');

export const getSongsByTitle = async (titles: Array<string>) =>
  await allAsync<Array<string>, Song>(
    `SELECT 
      hash, 
      title, 
      artist, 
      album 
    FROM songs
    WHERE title in (${titles.map(() => '?').join(',')})`,
    titles,
  );

export const getCount = async () => {
  try {
    const { count } = await getAsync<void, { count: number }>(
      `SELECT COUNT(*) AS 'count' FROM 'songs'`,
    );
    return count;
  } catch (error) {
    console.error('Error getting song count', error);
    return;
  }
};
