import { existsSync } from 'node:fs';
import { runFileServer } from './server.js';
import { mkdir } from 'node:fs/promises';
import { basePath } from './types.js';

process.title = 'musicUploader';

if (!existsSync(basePath)) {
  console.log('basePath missing creating...');
  await mkdir(basePath, { recursive: true });
}

runFileServer.start();
