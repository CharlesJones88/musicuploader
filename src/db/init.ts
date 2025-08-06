import { readdirSync, statSync } from 'fs';
import { parseFile } from 'music-metadata';
import path from 'path';
import { runAsync } from './db.js';
import { getCount, insertSong } from './song.js';
import { createHashingString, getHash } from '../utils.js';

const addFilesToDB = async (currentPath: string) => {
  for await (const discoveredFile of readdirSync(currentPath)) {
    const file = path.resolve(currentPath, discoveredFile);
    const stat = statSync(file);
    if (stat.isDirectory()) {
      await addFilesToDB(file);
    } else if (path.extname(discoveredFile).match(/\.(mp4|m4a|mp3)$/)) {
      const metadata = await parseFile(file);
      const { title, artist, album } = metadata.common;
      const hash = getHash(createHashingString(title, artist, album));
      await insertSong(hash, title, artist, album);
    }
  }
};

const createSongsTable = async () =>
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

export const initDB = async (currentPath: string) => {
  await createSongsTable();
  const songCount = await getCount();
  if (songCount == void 0 || songCount === 0) {
    await addFilesToDB(currentPath);
  }
};
