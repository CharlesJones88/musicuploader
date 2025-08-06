import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { fileServer } from './server.js';
import config from './config.json' with { type: 'json' };

const { basePath } = config;
process.title = 'musicUploader';

if (!existsSync(basePath)) {
  console.log('basePath missing creating...');
  await mkdir(basePath, { recursive: true });
}

fileServer.start();
