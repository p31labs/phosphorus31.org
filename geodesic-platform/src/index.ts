/**
 * P31 Geodesic Platform — Colyseus game server + optional Express API.
 * Port 2567: Colyseus (geodesic_world). Optional port 3001: REST API when DB is configured.
 */
import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'colyseus';
import { GeodesicRoom } from './rooms/GeodesicRoom.js';
import { getDb } from './db/index.js';

const COLYSEUS_PORT = parseInt(process.env.COLYSEUS_PORT ?? '2567', 10);
const API_PORT = parseInt(process.env.API_PORT ?? '3001', 10);

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const httpServer = createServer(app);

  const driver = await createDriver();
  const presence = await createPresence();
  const gameServer = new Server({
    server: httpServer,
    ...(driver && { driver }),
    ...(presence && { presence }),
  });

  gameServer.define('geodesic_world', GeodesicRoom).enableRealtimeListing();

  httpServer.listen(COLYSEUS_PORT, () => {
    console.log(`🚀 Colyseus running on port ${COLYSEUS_PORT}`);
  });

  const db = getDb();
  if (db) {
    GeodesicRoom.db = db;
    const { createApi } = await import('./api/index.js');
    const apiApp = createApi(db);
    apiApp.listen(API_PORT, () => {
      console.log(`📍 API running on port ${API_PORT}`);
    });
  }
}

async function createDriver() {
  try {
    const { RedisDriver } = await import('@colyseus/redis-driver');
    return new RedisDriver({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD,
      db: 0,
      retryStrategy: (times: number) => Math.min(times * 50, 2000),
    });
  } catch {
    return undefined;
  }
}

async function createPresence() {
  try {
    const { RedisPresence } = await import('@colyseus/redis-presence');
    return new RedisPresence({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      password: process.env.REDIS_PASSWORD,
    });
  } catch {
    return undefined;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
