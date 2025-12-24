import { Database, RestBindParameters } from '@db/sqlite';
import { dirname } from '@std/path';
import config from '../config.json' with { type: 'json' };
import { exists } from '../fileUtils/index.ts';

const { dbFile } = config;

if (!await exists(dbFile)) {
  await Deno.mkdir(dirname(dbFile), { recursive: true });
  (await Deno.open(dbFile, { create: true, write: true })).close();
}

const db = new Database(dbFile);

export function runAsync(
  query: string,
  ...params: RestBindParameters
) {
  try {
    const result = db.exec(query, params);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getAsync<Return extends object>(
  query: string,
  ...params: RestBindParameters
) {
  try {
    const result = db.prepare(query).get<Return>(params);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function allAsync<Return extends object>(
  query: string,
  ...params: RestBindParameters
) {
  try {
    const result = db.prepare(query).all<Return>(params);
    return Promise.resolve(result);
  } catch (error) {
    return Promise.reject(error);
  }
}
