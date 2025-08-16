import sqlite3 from 'sqlite3';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { mkdir, open } from 'node:fs/promises';
import config from '../config.json' with { type: 'json' };

const { dbFile } = config;

if (!existsSync(dbFile)) {
  await mkdir(path.dirname(dbFile), { recursive: true });
  await (await open(dbFile, 'w')).close();
}

const db = new sqlite3.Database(dbFile);

export const runAsync = <Params = unknown>(query: string, params?: Params) =>
  new Promise<void>((resolve: () => void, reject: (reason?: Error) => void) =>
    db.run(query, params, err => (err ? reject(err) : resolve())),
  );

export const getAsync = <Params = unknown, Return = unknown>(
  query: string,
  params?: Params,
) =>
  new Promise<Return>((resolve, reject: (reason?: Error) => void) =>
    db.get(query, params, (err: Error, data: Return) =>
      err ? reject(err) : resolve(data),
    ),
  );

export const allAsync = <Params = unknown, Return = unknown>(
  query: string,
  params?: Params,
) =>
  new Promise<Array<Return>>((resolve, reject: (reason?: Error) => void) =>
    db.all(query, params, (err: Error, rows: Array<Return>) =>
      err ? reject(err) : resolve(rows),
    ),
  );
