import User from "../models/user";

export interface UserRepository {
  findUserById(id: string): Promise<User>;

  findUserByEmail(email: string): Promise<User>;

  createUser(user: User): Promise<User>;

  deleteUser(userId: string);
}
