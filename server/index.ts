/**
 * Colyseus server for P31 Quantum Geodesic Platform
 * Run: npx ts-node index.ts  (or npm run dev)
 * Listens on ws://localhost:2567 by default.
 */
import { Server } from 'colyseus';
import { createServer } from 'http';
import { GeodesicRoom } from './rooms/GeodesicRoom';

const port = Number(process.env.PORT ?? 2567);
const server = createServer();
const gameServer = new Server({ server });

gameServer.define('geodesic_world', GeodesicRoom);

server.listen(port, () => {
  console.log(`P31 Geodesic server listening on ws://localhost:${port}`);
});
