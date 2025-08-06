import { WebSocketServer } from 'ws';
import express from 'express';
import config from './config.json' with { type: 'json' };
import { router } from './routes.js';
import { initDB } from './db/init.js';
import { getSongsByTitle } from './db/song.js';

const { basePath } = config;
const app = express();

const getFilesToSend = async (songsRequest: Array<string>) => {
  const filteredTitles = Object.groupBy(
    await getSongsByTitle(songsRequest),
    song => song.title,
  );

  return songsRequest.filter(song => !Object.hasOwn(filteredTitles, song));
};

export const fileServer = {
  start: async () => {
    await initDB(basePath);

    const { PORT = '8200', WS_PORT = '8222' } = process.env;

    const wss = new WebSocketServer({
      port: +WS_PORT,
    });

    wss.on('listening', () => {
      console.log(`WS now listening on port: ${WS_PORT}`);
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

    app.use(router);
    app.listen(+PORT, () => console.log(`Now listening on port: ${PORT}`));
  },
};
