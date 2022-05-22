import { actor } from './db';

(async () => {
  const actors = await actor.findByYearAndLastName(
    2006,
    'Goldberg');

  console.log(actors);

  let count: number;

  count = await actor.updateLastNameByIds(
    'Goldberg',
    [-1, 0, -1, -1, 0]);

  console.log('Trans update: ' + count);

  count = await actor.updateFirstNameByIds(
    'Parker',
    [-1, 0, -1, -1, 0]);

  console.log('Array update: ' + count);
})().then(() => console.log('DONE'));
