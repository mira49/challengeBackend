import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post
} from "@nestjs/common";
import EventService from "../../domain/services/event.service";
import UserService from "../../domain/services/user.service";
import EventVM from "../event/entities/EventVM";
import RegisterUserReq from "./entities/RegisterUserReq";
import UserVM from "./entities/UserVM";

@Controller("api/v1/users")
export default class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly eventService: EventService
  ) {}

  @Get(":id")
  async findOneUser(@Param("id") id: string): Promise<UserVM> {
    Logger.log(`Get user with id : ${id}`);
    const user = await this.userService.getUser(id);
    const events = await this.eventService.getEventsByUserId(id);
    return UserVM.getUserVM(user, EventVM.getConsents(events));
  }

  @Delete(":id")
  async deleteOneUser(@Param("id") id: string): Promise<void> {
    Logger.log(`Delete user with id : ${id}`);
    await this.userService.deleteUser(id);
  }

  @Post()
  async createUser(@Body() userRegisterReq: RegisterUserReq): Promise<UserVM> {
    Logger.log(`Create user with email : ${userRegisterReq.email}`);
    const user = await this.userService.createUser(userRegisterReq.email);
    return UserVM.getUserVM(user, []);
  }
}
