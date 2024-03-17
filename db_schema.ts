import {
  type GeneratedAlways,
  Insertable,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  users: UsersTable;
}

export interface UsersTable {
  user_id: GeneratedAlways<number>;
  github_id: number;
  email: string;
  name: string;
}

export type Users = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;
