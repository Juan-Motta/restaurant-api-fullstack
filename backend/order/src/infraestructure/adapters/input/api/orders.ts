import * as http from 'http';
import { db } from '../../output/database';

export async function getOrders(req: http.IncomingMessage, res: http.ServerResponse) {
  await db.connect();
  const data = await db.query('SELECT * FROM users');
  console.log(data.rows);
  await db.end();
  const orders = {id: 1, name: 'hola'};
  res.end(JSON.stringify(orders));
}