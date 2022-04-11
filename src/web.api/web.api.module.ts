import { Module } from "@nestjs/common";
import DomainModule from "../domain/domain.module";
import EventController from "./event/event.controller";
import UserController from "./user/user.controller";

@Module({
  imports: [DomainModule],
  controllers: [UserController, EventController]
})
export default class WebApiModule {}
