import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import UserService from "../../domain/services/user.service";
import RegisterUserReq from "./entities/RegisterUserReq";
import UserVM from "./entities/UserVM";

@Controller("api/v1/users")
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async findOneUser(@Param("id") id: string): Promise<UserVM> {
    const user = await this.userService.getUser(id);
    return UserVM.getUserVM(user, []);
  }

  @Delete(":id")
  async deleteOneUser(@Param("id") id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }

  @Post()
  async createUser(@Body() userRegisterReq: RegisterUserReq): Promise<UserVM> {
    const user = await this.userService.createUser(userRegisterReq.email);
    return UserVM.getUserVM(user, []);
  }
}
