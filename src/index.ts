import process from 'node:process';
import { fileServer } from './server.ts';
import config from './config.json' with { type: 'json' };
import { exists } from './fileUtils/index.ts';
import { logger } from './logger/index.ts';

const { basePath } = config;
process.title = 'musicUploader';

if (!await exists(basePath)) {
  logger.debug('basePath missing creating...');
  await Deno.mkdir(basePath, { recursive: true });
}

fileServer.start();
