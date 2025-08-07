import { Router } from 'express';
import { createWriteStream } from 'node:fs';
import config from './config.json' with { type: 'json' };
import { insertSong, getAllSongs, deleteSong } from './db/song.js';
import { Song } from './Song.js';
import { createHashingString, getHash } from './utils.js';
import { mkdir } from 'node:fs/promises';

const { basePath } = config;
const router = Router();

router.get<void, Array<Song>, void, void>('/songs', async (_, res) =>
  res.send(await getAllSongs()),
);

router.post<
  void,
  void,
  void,
  { title: string; artist: string; album: string; fileName: string }
>('/file', async (req, res) => {
  const { title, artist, album, fileName } = req.query;
  const hash = getHash(createHashingString(title, artist, album));
  if (artist == void 0 || album == void 0) {
    return res.status(400).send();
  }
  const dir = `${basePath}/${artist}/${album}`;
  console.log(`Received song ${title} write to directory ${dir}`);
  await mkdir(dir, { recursive: true });
  req.pipe(createWriteStream(`${dir}/${fileName}`));
  console.log('Writing file...');
  req.on('error', async err => {
    console.error(err);
    await deleteSong(hash);
  });

  req.on('close', async () => {
    console.log(`Successfully uploaded file ${fileName}`);
    await insertSong(hash, title, artist, album);
    res.status(200).send();
  });
});

export { router };
