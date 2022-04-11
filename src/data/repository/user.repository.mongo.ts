import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { UserRepository } from "src/domain/ports/user.repository";
import User from "src/domain/models/user";
import { UserEntity } from "../entity/user/user.entity";
import UserMapper from "../entity/user/user.mapper";

@Injectable()
export default class UserRepositoryMongo implements UserRepository {
  constructor(
    @InjectModel("User") private readonly userModel: Model<UserEntity>
  ) {}

  public async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return UserMapper.toDomain(user);
  }

  public async createUser(user: User): Promise<User> {
    let userCreated = new this.userModel(user);
    userCreated = await userCreated.save();
    return UserMapper.toDomain(userCreated);
  }

  public async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    return UserMapper.toDomain(user);
  }

  public async deleteUser(userId: string): Promise<void> {
    await this.userModel.findByIdAndDelete(userId);
  }
}
