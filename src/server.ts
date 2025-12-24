import { WebSocketServer } from 'ws';
import config from './config.json' with { type: 'json' };
import { Handler, Methods, Request, router } from './route/index.ts';
import { initDB } from './db/init.ts';
import { getSongsByTitle } from './db/song.ts';

const { basePath } = config;

const getFilesToSend = async (songsRequest: Array<string>) => {
  const filteredTitles = Object.groupBy(
    await getSongsByTitle(songsRequest),
    (song) => song.title,
  );

  return songsRequest.filter((song) => !Object.hasOwn(filteredTitles, song));
};

export const fileServer = {
  start: async () => {
    await initDB(basePath);

    const port = Deno.env.get('PORT') ?? '8200';
    const wsPort = Deno.env.get('WS_PORT') ?? '8222';

    const wss = new WebSocketServer({
      port: +wsPort,
    });

    wss.on('listening', () => {
      console.info(`WS now listening on port: ${wsPort}`);
    });

    wss.on('connection', (ws) => {
      console.info('Client connected, waiting for message.');
      ws.addEventListener('message', async (message) => {
        const songsToSend =
          (await getFilesToSend(JSON.parse(message.data.toString()))) ?? [];
        console.info(`${songsToSend.length} songs missing from server`);
        ws.send(JSON.stringify(songsToSend));
      });
    });

    Deno.serve({
      port: +port,
      onListen({ port }) {
        console.info(`Now listening on port: ${port}`);
      },
    }, (request) => {
      const url = new URL(request.url);

      let handler: Handler<Request> | undefined;
      let pattern: URLPattern | undefined;
      for (const [pathname, pathHandler] of Object.entries(router._routes)) {
        pattern = new URLPattern({ pathname });
        if (pattern.test(url)) {
          handler = pathHandler[request.method.toLowerCase() as Methods];
          break;
        }
      }

      if (handler == undefined) {
        return new Response('Not Found', { status: 404 });
      }

      const match = pattern?.exec(url);

      return handler({
        ...request,
        hash: match?.hash.groups,
        path: match?.pathname.groups,
        query: match?.search.groups,
      });
    });
  },
};
