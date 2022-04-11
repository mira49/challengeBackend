import { Injectable, Inject } from "@nestjs/common";
import { UserRepository } from "src/domain/ports/user.repository";
import User from "../models/user";
import UserAlreadyExistsException from "../exceptions/UserAlreadyExistsException";
import UserNotFoundException from "../exceptions/UserNotFoundException";

@Injectable()
export default class UserService {
  constructor(
    @Inject("UserRepository") private userRepository: UserRepository
  ) {}

  /**
   * Get user by id
   * @param userId
   * @returns
   */
  public async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }
    return user;
  }

  /**
   * Delete user by id
   * @param userId
   */
  public async deleteUser(userId: string): Promise<void> {
    await this.getUser(userId);
    await this.userRepository.deleteUser(userId);
  }

  /**
   * Create user with email
   * @param email
   * @returns
   */
  public async createUser(email: string): Promise<User> {
    if (await this.userRepository.findUserByEmail(email)) {
      throw new UserAlreadyExistsException(email);
    }
    const user = new User(email);
    return this.userRepository.createUser(user);
  }
}
