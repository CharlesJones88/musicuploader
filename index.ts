import { existsSync } from 'node:fs';
import { runFileServer } from './Server.js';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { basePath } from './types.js';

process.title = 'musicUploader';

if (!existsSync(basePath)) {
  console.log('basePath missing creating...');
  await mkdir(path.dirname(basePath), { recursive: true });
}

runFileServer.start();
