import config from '../config.json' with { type: 'json' };
import { deleteSong, getAllSongs, insertSong } from '../db/song.ts';
import { createHashingString, getHash } from '../utils.ts';
import { router } from './router.ts';

const { basePath } = config;

router.get(
  '/songs',
  async () => new Response(JSON.stringify(await getAllSongs())),
);

router.post<
  void,
  { title: string; artist: string; album: string; fileName: string },
  void
>('/file', async (request) => {
  const { title, artist, album, fileName } = request.query;
  const hash = getHash(createHashingString(title, artist, album));

  if (artist == void 0 || album == void 0) {
    return new Response('Bad Request', { status: 400 });
  }

  const dir = `${basePath}/${artist}/${album}`;
  console.info(`Received song ${title} write to directory ${dir}`);
  await Deno.mkdir(dir, { recursive: true });

  const { body } = request;
  await using file = await Deno.create(`${dir}/${fileName}`);
  try {
    console.info('Writing file...');
    await body?.pipeTo(file.writable);
    console.info(`Successfully uploaded file ${fileName}`);
    await insertSong(hash, title, artist, album);
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error(error);
    await deleteSong(hash);
    return new Response('Internal Server Error', { status: 500 });
  }
});

export { router };
