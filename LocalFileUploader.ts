import fs from "fs";
import path from "path";
import * as mm from "music-metadata";

import { connect, createSongsTable, insertSong } from "./db";
import { createHashingString, getHash } from "./Utils";
import { DB_FILE } from "./types";

export const addLocalMusicFilesToDB = async (currentPath: string) => {
  if (fs.existsSync(DB_FILE)) {
    fs.unlinkSync(DB_FILE);
    fs.closeSync(fs.openSync(DB_FILE, 'w'));
  }

  connect();
  await createSongsTable();
  for await (const discoveredFile of fs.readdirSync(currentPath)) {
    const file: string = path.resolve(currentPath, discoveredFile);
    const stat: fs.Stats = fs.statSync(file);
    if (stat?.isDirectory()) {
      await addLocalMusicFilesToDB(file);
    } else if (path.extname(discoveredFile).match(/\.(mp4|m4a|mp3)$/)) {
      const metadata: mm.IAudioMetadata = await mm.parseFile(file);
      const { title, artist, album } = metadata.common;
      const hash = getHash(
        createHashingString(title as string, artist as string, album as string)
      );
      console.log(`Inserting ${hash}\t${title}\t${artist}\t${album}`);
      await insertSong(
        hash,
        title as string,
        artist as string,
        album as string
      );
    }
  }
};
