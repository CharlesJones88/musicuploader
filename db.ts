import sqlite3 from 'sqlite3';
import {DB_FILE, Song} from './types';

let db: sqlite3.Database = new sqlite3.Database(DB_FILE);

const runAsync: (query: string, params?: any) => Promise<any> = (
  query: string,
  params?: any,
) =>
  new Promise(
    (resolve: (value?: any) => void, reject: (reason?: any) => void) =>
      db.run(query, params, (err: Error) => (err ? reject(err) : resolve())),
  );

const getAsync = (query: string, params?: any): Promise<any> =>
  new Promise(
    (resolve: (value?: any) => void, reject: (reason?: any) => void) =>
      db.get(query, params, (err: Error, data: any) =>
        err ? reject(err) : resolve(data),
      ),
  );

const allAsync = (query: string, params?: any): Promise<any> =>
  new Promise(
    (resolve: (value?: any) => void, reject: (reason?: any) => void) =>
      db.all(query, params, (err: Error, rows: Array<any>) =>
        err ? reject(err) : resolve(rows),
      ),
  );

export const connect = (): void => {
  db = new sqlite3.Database(DB_FILE);
};

export const createSongsTable = async (): Promise<void> =>
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

export const insertSong = async (
  hash: string,
  title: string,
  artist: string,
  album: string,
): Promise<void> =>
  await runAsync(
    'INSERT OR IGNORE INTO songs (hash, title, artist, album) VALUES ($hash, $title, $artist, $album)',
    {
      $hash: hash,
      $title: title,
      $artist: artist,
      $album: album,
    },
  );

export const getSong = async (hash: string): Promise<Song> =>
  await getAsync(
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

export const getSongCount = async (): Promise<number> => {
  const {count} = await getAsync(`SELECT COUNT(*) AS count FROM songs`);
  return count;
};

export const getAllSongs = async (): Promise<Array<Song>> =>
  await allAsync('SELECT hash, title, artist, album FROM songs');

export const getSongsByTitle = async (
  titles: Array<string>,
): Promise<Array<Song>> =>
  await allAsync(
    `SELECT 
      hash, 
      title, 
      artist, 
      album 
    FROM songs
    WHERE title in (${titles.map(() => '?').join(',')})`,
    titles,
  );
