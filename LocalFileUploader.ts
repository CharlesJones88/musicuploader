import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';
import { connect, createSongsTable, getSongCount, insertSong } from './db';
import { createHashingString, getHash } from './Utils';

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

export const initDB = async (currentPath: string) => {
  connect();
  await createSongsTable();
  const songCount = await getCount();
  if (songCount == void 0 || songCount === 0) {
    await addFilesToDB(currentPath);
  }
};

const addFilesToDB = async (currentPath: string) => {
  for await (const discoveredFile of fs.readdirSync(currentPath)) {
    const file = path.resolve(currentPath, discoveredFile);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      await addFilesToDB(file);
    } else if (path.extname(discoveredFile).match(/\.(mp4|m4a|mp3)$/)) {
      const metadata = await mm.parseFile(file);
      const { title, artist, album } = metadata.common;
      const hash = getHash(
        createHashingString(title, artist, album),
      );
      await insertSong(
        hash,
        title,
        artist,
        album,
      );
    }
  }
};
