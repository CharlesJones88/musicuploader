import { statSync, readdirSync } from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import { createSongsTable, getSongCount, insertSong } from './db.js';
import { createHashingString, getHash } from './utils.js';

const getCount = async () => {
  try {
    const songCount = await getSongCount();
    console.log(`Songs in db`, songCount);
    return songCount;
  } catch (err) {
    console.error('Error getting song count', err);
    return;
  }
};

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

export const initDB = async (currentPath: string) => {
  await createSongsTable();
  const songCount = await getCount();
  if (songCount == void 0 || songCount === 0) {
    await addFilesToDB(currentPath);
  }
};
