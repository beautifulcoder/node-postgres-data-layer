import { ActorDto } from './model/ActorDto'

export interface ActorDb {
  findByYearAndLastName(
    year: number, lastName: string): Promise<ActorDto[]>

  updateLastNameByIds(
    lastName: string, ids: number[]): Promise<number>

  updateFirstNameByIds(
    firstName: string, ids: number[]): Promise<number>
}
