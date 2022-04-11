import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection } from "mongoose";
import EventRepositoryMongo from "../../data/repository/event.repository.mongo";
import UserRepositoryMongo from "../../data/repository/user.repository.mongo";
import EventSchema from "../../data/entity/event/event.schema";
import UserSchema from "../../data/entity/user/user.schema";
import DomainModule from "../../domain/domain.module";
import ConfigModule from "../../data/config.module";
import ConfigService from "../../data/config.service";
import EventController from "./event.controller";
import EventService from "../../domain/services/event.service";
import CreateConsentsReq from "./entities/CreateConsentsReq";
import UserController from "../user/user.controller";
import RegisterUserReq from "../user/entities/RegisterUserReq";
import { ConsentType } from "./entities/EventVM";

const dbUri = "MONGO_SERVER_URL";
const dbPort = "MONGO_SERVER_PORT";
const dbName = "MONGO_SERVER_DBNAME";
const emailValid = "testEvent@test.fr";

describe("EventController", () => {
  let eventController: EventController;
  let userController: UserController;
  let app: TestingModule;
  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: `mongodb://${configService.get(dbUri)}:${configService.get(
              dbPort
            )}/${configService.get(dbName)}`
          }),
          inject: [ConfigService]
        }),
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
        ]),
        DomainModule
      ],
      controllers: [EventController, UserController],
      providers: [
        EventService,
        {
          provide: "UserRepository",
          useClass: UserRepositoryMongo
        },
        {
          provide: "EventRepository",
          useClass: EventRepositoryMongo
        }
      ]
    }).compile();

    eventController = app.get<EventController>(EventController);
    userController = app.get<UserController>(UserController);
  });

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  describe("root", () => {
    it("Create event ==> OK", async () => {
      const userSaved = await userController.createUser(
        new RegisterUserReq(emailValid)
      );
      const eventSaved = await eventController.createEvent(
        new CreateConsentsReq(userSaved.id, true, false)
      );
      expect(eventSaved).toBeTruthy();
      expect(eventSaved.user.id).toBe(userSaved.id);
      expect(eventSaved.consents[0].id).toBe(ConsentType.email);
      expect(eventSaved.consents[0].enabled).toBe(true);
    });
  });
});
