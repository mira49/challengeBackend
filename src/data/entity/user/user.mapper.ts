import User from '../../../domain/models/user';
import { UserEntity } from './user.entity';

export default class UserMapper {
  /**
   * Get User from UserEntity
   * @param userEntity
   * @returns
   */
  public static toDomain(userEntity: UserEntity): User {
    return userEntity
      ? new User(userEntity.email, userEntity.id, new Date(userEntity.createAt))
      : null;
  }
}
