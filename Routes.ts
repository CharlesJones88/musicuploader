import express from 'express';
import mkdirp from 'mkdirp';
import {createWriteStream} from 'fs';
import {insertSong} from './db';
import {basePath} from './types';
import {createHashingString, getHash} from './Utils';

const router: express.Router = express.Router();

router.post('/file', (req: express.Request, _, next: express.NextFunction) => {
  const {title, artist, album, fileName} = req.query;
  const dir: string = `${basePath}/${artist}/${album}`;
  console.log(`Received song ${title} write to directory ${dir}`);
  mkdirp.sync(dir);
  req.pipe(createWriteStream(`${dir}/${fileName}`));
  req.on('end', () => {
    const hash = getHash(
      createHashingString(title as string, artist as string, album as string),
    );
    insertSong(hash, title as string, artist as string, album as string);
    next();
  });
});

router.get('/status', (_, res: express.Response) => res.send('SUCCESS'));

export {router};
