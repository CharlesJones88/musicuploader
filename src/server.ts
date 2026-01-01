import config from './config.json' with { type: 'json' };
import { Handler, Methods, Request } from './router/index.ts';
import { router } from './routes/index.ts';
import { initDB } from './db/init.ts';
import { getSongsByTitle } from './db/song.ts';
import { logger } from './logger/index.ts';

const { basePath } = config;

const getFilesToSend = async (songsRequest: Array<string>) => {
  const titleSongs = await getSongsByTitle(songsRequest);
  const filteredTitles = Object.groupBy(
    titleSongs,
    (song) => song.title,
  );

  return songsRequest.filter((song) => !Object.hasOwn(filteredTitles, song));
};

export const fileServer = {
  start: async () => {
    await initDB(basePath);

    const port = Deno.env.get('PORT') ?? '8200';
    const wsPort = Deno.env.get('WS_PORT') ?? '8222';

    Deno.serve({
      port: +wsPort,
      onListen({ port }) {
        logger.info(`WS now listening on port: ${port}`);
      },
    }, (request) => {
      if (request.headers.get('upgrade') !== 'websocket') {
        return new Response(null, { status: 426 });
      }

      const { socket, response } = Deno.upgradeWebSocket(request);
      logger.info('Client connected, waiting for message.');
      socket.addEventListener('message', async (message) => {
        const songsToSend =
          (await getFilesToSend(JSON.parse(message.data.toString()))) ?? [];
        logger.info(`${songsToSend.length} songs missing from server`);
        socket.send(JSON.stringify(songsToSend));
      });
      return response;
    });

    Deno.serve({
      port: +port,
      onListen({ port }) {
        logger.info(`Now listening on port: ${port}`);
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

      const resolvedRequest = request as unknown as Request;
      resolvedRequest.hash = match?.hash.groups;
      resolvedRequest.path = match?.pathname.groups;
      resolvedRequest.query = new URLSearchParams(
        match?.search.input,
      );
      return handler(resolvedRequest);
    });
  },
};
