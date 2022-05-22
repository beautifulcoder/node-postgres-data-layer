import { Pool, QueryResult } from 'pg';
import { ActorDto } from '../model/ActorDto'

export class Actor {
  #pool: Pool;

  constructor(pool: Pool) {
    this.#pool = pool;
  }

  async findByYearAndLastName(
    year: number, lastName: string): Promise<ActorDto[]> {
    const res =  await this.#pool.query(`
      SELECT a.actor_id,
        a.first_name,
        a.last_name,
        f.title,
        f.rental_rate,
        a.last_update
      FROM actor AS a
      INNER JOIN film_actor AS fa ON a.actor_id = fa.actor_id
      INNER JOIN film AS f ON fa.film_id = f.film_id
      WHERE f.release_year = $1 AND a.last_name = $2
    `, [year, lastName]);

    return Actor.mapActorResult(res);
  }

  async updateLastNameByIds(
    lastName: string, ids: number[]): Promise<number> {
    let count = 0;
    const client = await this.#pool.connect();

    try {
      await client.query('BEGIN');

      const result = await Promise.all(ids.map(id =>
        client.query(`
          UPDATE actor
          SET last_name = $1
          WHERE actor_id = $2
        `, [lastName, id])));

      await client.query('COMMIT');
      count = result.map(r => r.rowCount).reduce((c, v) => c + v, count);
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return count;
  }

  async updateFirstNameByIds(
    firstName: string, ids: number[]): Promise<number> {
    const res = await this.#pool.query(`
      UPDATE actor
      SET first_name = $1
      WHERE actor_id = ANY($2)
    `, [firstName, ids]);

    return res.rowCount;
  }

  private static mapActorResult =
    (res: QueryResult): ActorDto[] =>
      res.rows.map(r => ({
        actorId: r.actor_id,
        firstName: r.first_name,
        lastName: r.last_name,
        movie: r.title,
        rentalRate: r.rental_rate,
        lastUpdate: r.last_update
      }));
}
