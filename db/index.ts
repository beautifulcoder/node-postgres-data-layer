import { Pool, types } from 'pg';
import { ActorDb } from './ActorDb'
import { Actor } from './pg/Actor';

const connectionString = 'postgres://postgres:postgres@127.0.0.1:5432/dvdrental';

const pool = new Pool({
  connectionString
});

const NUMERIC_OID = 1700;

types.setTypeParser(NUMERIC_OID, (val) =>
  parseFloat(val)
);

export const actor: ActorDb = new Actor(pool);
