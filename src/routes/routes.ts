import config from '../config.json' with { type: 'json' };
import { deleteSong, getAllSongs, insertSong } from '../db/song.ts';
import { createHashingString, getHash } from '../utils.ts';
import { router } from '../router/router.ts';

const { basePath } = config;

router.get(
  '/songs',
  async () => new Response(JSON.stringify(await getAllSongs())),
);

router.post('/file', async (request) => {
  const title = request.query.get('title') ?? undefined;
  const artist = request.query.get('artist') ?? undefined;
  const album = request.query.get('album') ?? undefined;
  const fileName = request.query.get('fileName') ?? undefined;
  const hash = getHash(createHashingString(title, artist, album));

  if (artist == void 0 || album == void 0) {
    console.error('Missing required query params', request.query);
    return new Response('Bad Request', { status: 400 });
  }

  const dir = `${basePath}/${artist}/${album}`;
  console.info(`Received song ${title} write to directory ${dir}`);
  await Deno.mkdir(dir, { recursive: true });

  const { body } = request;
  try {
    await using file = await Deno.create(`${dir}/${fileName}`);
    console.info('Writing file...');
    await body?.pipeTo(file.writable);
    console.info(`Successfully uploaded file ${fileName}`);
    await insertSong(hash, title, artist, album);
    console.info(`Successfully added ${fileName}`)
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    await deleteSong(hash);
    return new Response('Internal Server Error', { status: 500 });
  }
});

export { router };
