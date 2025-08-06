import { Router } from 'express';
import { createWriteStream } from 'fs';
import { insertSong, getAllSongs, deleteSong } from './db.js';
import { basePath, Song } from './types.js';
import { createHashingString, getHash } from './Utils.js';
import { mkdir } from 'fs/promises';

const router = Router();

router.get<void, Array<Song>, void, void>('/songs', async (_, res) =>
  res.send(await getAllSongs()),
);

router.post<
  void,
  void,
  void,
  { title: string; artist: string; album: string; fileName: string }
>('/file', async (req, res, next) => {
  const { title, artist, album, fileName } = req.query;
  const hash = getHash(createHashingString(title, artist, album));
  if (artist == void 0 || album == void 0) {
    return next();
  }
  const dir = `${basePath}/${artist}/${album}`;
  console.log(`Received song ${title} write to directory ${dir}`);
  await mkdir(dir, { recursive: true });
  req.pipe(createWriteStream(`${dir}/${fileName}`));
  console.log('Writing file...');
  req.on('error', async err => {
    console.error(err);
    await deleteSong(hash);
    next();
  });

  req.on('end', () => res.end());

  req.on('close', async () => {
    console.log(`Successfully uploaded file ${fileName}`);
    await insertSong(hash, title, artist, album);
    res.status(200).send();
    next();
  });
});

router.get<void, string, void, void>('/status', (_, res) =>
  res.send('SUCCESS'),
);

export { router };
