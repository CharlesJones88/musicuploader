import express from 'express';
import mkdirp from 'mkdirp';
import { createWriteStream } from 'fs';
import { insertSong, getAllSongs, deleteSong } from './db';
import { basePath } from './types';
import { createHashingString, getHash } from './Utils';

const router: express.Router = express.Router();

router.get('/songs', async (_, res: express.Response) =>
  res.send(await getAllSongs())
);

router.post('/file', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { title, artist, album, fileName } = req.query;
  const hash: string = getHash(
    createHashingString(title as string, artist as string, album as string),
  );
  if (artist == void 0 || album == void 0) {
    return next();
  }
  const dir: string = `${basePath}/${artist}/${album}`;
  console.log(`Received song ${title} write to directory ${dir}`);
  mkdirp.sync(dir);
  req.pipe(createWriteStream(`${dir}/${fileName}`));
  console.log('Writing file...');
  req.on('error', async (err: Error) => {
    console.error(err);
    await deleteSong(hash);
    next();
  });

  req.on('end', () => res.end());

  req.on('close', async () => {
    console.log(`Successfully uploaded file ${fileName}`);
    await insertSong(hash, title as string, artist as string, album as string);
    res.status(200).send();
    next();
  });
});

router.get('/status', (_, res: express.Response) => res.send('SUCCESS'));

export { router };
