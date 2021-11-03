import WebSocket from 'ws';
import express from 'express';
import {basePath, Song} from './types';
import {router} from './Routes';
import {getSongsByTitle} from './db';
import {initDB} from './LocalFileUploader';

export const runFileServer = {
  start: (): void => {
    const wss: WebSocket.Server = new WebSocket.Server({
      port: 8222,
    });

    wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected, waiting for message.');
      ws.on('message', async (message: WebSocket.Data) => {
        console.log(`Getting list of songs that aren't on server`);
        const songsToSend: Array<string> = await getFilesToSend(
          JSON.parse(message.toString()),
        );
        console.log(`${(songsToSend ?? []).length} songs missing from server`);
        ws.send(JSON.stringify(songsToSend ?? []));
      });
    });

    const getFilesToSend = async (
      songsRequest: Array<string>,
    ): Promise<Array<string>> => {
      await initDB(basePath);
      const filteredTitles: Array<Song> = await getSongsByTitle(songsRequest);

      return songsRequest.filter(
        (song: string) =>
          filteredTitles.find(({title}: Song) => song === title) == void 0,
      );
    };

    const PORT: number = 8200;
    const app = express();
    app.use(router);
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  },
};
