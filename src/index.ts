import process from 'node:process';
import { fileServer } from './server.ts';
import config from './config.json' with { type: 'json' };
import { exists } from './fileUtils/index.ts';

const { basePath } = config;
process.title = 'musicUploader';

if (!await exists(basePath)) {
  console.log('basePath missing creating...');
  await Deno.mkdir(basePath, { recursive: true });
}

fileServer.start();
