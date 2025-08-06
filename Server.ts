import { WebSocketServer } from 'ws';
import express from 'express';
import { basePath } from './types.js';
import { router } from './Routes.js';
import { getSongsByTitle } from './db.js';
import { initDB } from './LocalFileUploader.js';

const getFilesToSend = async (songsRequest: Array<string>) => {
  const filteredTitles = Object.groupBy(
    await getSongsByTitle(songsRequest),
    song => song.title,
  );

  return songsRequest.filter(song => !Object.hasOwn(filteredTitles, song));
};

export const runFileServer = {
  start: async () => {
    await initDB(basePath);

    const wss = new WebSocketServer({
      port: 8222,
    });

    wss.on('connection', ws => {
      console.log('Client connected, waiting for message.');
      ws.addEventListener('message', async message => {
        const songsToSend =
          (await getFilesToSend(JSON.parse(message.toString()))) ?? [];
        console.log(`${songsToSend.length} songs missing from server`);
        ws.send(JSON.stringify(songsToSend));
      });
    });

    const PORT = 8200;
    const app = express();
    app.use(router);
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  },
};
