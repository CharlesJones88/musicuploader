import sqlite3 from 'sqlite3';
import { DB_FILE, Song } from './types';

let db = new sqlite3.Database(DB_FILE);

const runAsync = <Params = unknown>(query: string, params?: Params) =>
  new Promise<void>((resolve: () => void, reject: (reason?: Error) => void) =>
    db.run(query, params, err => (err ? reject(err) : resolve())),
  );

const getAsync = <Params = unknown, Return = unknown>(
  query: string,
  params?: Params,
) =>
  new Promise<Return>((resolve, reject: (reason?: Error) => void) =>
    db.get(query, params, (err: Error, data: Return) =>
      err ? reject(err) : resolve(data),
    ),
  );

const allAsync = <Params = unknown, Return = unknown>(
  query: string,
  params?: Params,
) =>
  new Promise<Array<Return>>((resolve, reject: (reason?: Error) => void) =>
    db.all(query, params, (err: Error, rows: Array<Return>) =>
      err ? reject(err) : resolve(rows),
    ),
  );

export const connect = () => {
  db = new sqlite3.Database(DB_FILE);
};

export const createSongsTable = async () =>
  await runAsync(
    `CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY,
    hash VARCHAR (64) NOT NULL,
    title TEXT NOT NULL,
    artist TEXXT NOT NULL,
    album TEXT NOT NULL,
    UNIQUE(hash, title, artist, album)
  )`,
  );

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

export const getSongCount = async () => {
  const { count } = await getAsync<void, { count: number }>(
    `SELECT COUNT(*) AS 'count' FROM 'songs'`,
  );
  return count;
};

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
