import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import UserService from "./services/user.service";
import UserSchema from "../data/entity/user/user.schema";
import UserRepositoryMongo from "../data/repository/user.repository.mongo";
import EventSchema from "../data/entity/event/event.schema";
import EventService from "./services/event.service";
import EventRepositoryMongo from "../data/repository/event.repository.mongo";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "User",
        schema: UserSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: "Event",
        schema: EventSchema
      }
    ])
  ],
  providers: [
    UserService,
    EventService,
    {
      provide: "UserRepository",
      useClass: UserRepositoryMongo
    },
    {
      provide: "EventRepository",
      useClass: EventRepositoryMongo
    }
  ],
  exports: [UserService, EventService]
})
export default class DomainModule {}
