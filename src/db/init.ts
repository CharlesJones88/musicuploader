import { parseFile } from 'music-metadata';
import { extname, resolve } from '@std/path';
import { runAsync } from './db.ts';
import { getCount, insertSong } from './song.ts';
import { createHashingString, getHash } from '../utils.ts';
import { readDir, stat } from '../fileUtils/index.ts';

const addFilesToDB = async (currentPath: string) => {
  for await (const discoveredFile of readDir(currentPath)) {
    const file = resolve(currentPath, discoveredFile.name);
    const fileInfo = await stat(file);
    if (fileInfo.isDirectory) {
      await addFilesToDB(file);
    } else if (extname(discoveredFile.name).match(/\.(mp4|m4a|mp3)$/)) {
      const metadata = await parseFile(file);
      const { title, artist, album } = metadata.common;
      const hash = getHash(createHashingString(title, artist, album));
      await insertSong(hash, title, artist, album);
    }
  }
};

async function createSongsTable() {
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
}

export async function initDB(currentPath: string) {
  await createSongsTable();
  const songCount = await getCount();
  if (songCount == void 0 || songCount === 0) {
    await addFilesToDB(currentPath);
  }
}
