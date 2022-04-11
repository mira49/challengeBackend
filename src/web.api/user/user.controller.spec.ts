import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection } from "mongoose";
import EventRepositoryMongo from "../../data/repository/event.repository.mongo";
import UserRepositoryMongo from "../../data/repository/user.repository.mongo";
import EventSchema from "../../data/entity/event/event.schema";
import UserSchema from "../../data/entity/user/user.schema";
import DomainModule from "../../domain/domain.module";
import UserService from "../../domain/services/user.service";
import UserController from "./user.controller";
import ConfigModule from "../../data/config.module";
import ConfigService from "../../data/config.service";
import UserNotFoundException from "../../domain/exceptions/UserNotFoundException";
import ValidationException from "../../domain/exceptions/ValidationException";
import UserAlreadyExistsException from "../../domain/exceptions/UserAlreadyExistsException";
import RegisterUserReq from "./entities/RegisterUserReq";

const dbUri = "MONGO_SERVER_URL";
const dbPort = "MONGO_SERVER_PORT";
const dbName = "MONGO_SERVER_DBNAME";
const emailValid = "testUser@test.fr";
const emailInvalid = "emailInvalid";
const idInexistantUser = "5db9443fc4889c000681f502";

describe("UserController", () => {
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
      controllers: [UserController],
      providers: [
        UserService,
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

    userController = app.get<UserController>(UserController);
  });

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  describe("root", () => {
    it("Create user ==> OK", async () => {
      const userSaved = await userController.createUser(
        new RegisterUserReq(emailValid)
      );
      expect(userSaved).toBeTruthy();
      expect(userSaved.id).not.toBeUndefined();
    });
  });

  describe("root", () => {
    it("Delete user ==> OK", async () => {
      const userSaved = await userController.createUser(
        new RegisterUserReq(emailValid)
      );
      await userController.deleteOneUser(userSaved.id);
      try {
        await userController.findOneUser(userSaved.id);
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  describe("root", () => {
    it("Delete no existing user ==> KO", async () => {
      try {
        await userController.deleteOneUser(idInexistantUser);
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  describe("root", () => {
    it("Get User", async () => {
      const userSaved = await userController.createUser(
        new RegisterUserReq(emailValid)
      );
      const userGet = await userController.findOneUser(userSaved.id);
      expect(userGet.id).toBe(userSaved.id);
    });
  });

  describe("root", () => {
    it("Create user with invalid email ==> KO", async () => {
      try {
        await userController.createUser(new RegisterUserReq(emailInvalid));
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationException);
      }
    });
  });

  describe("root", () => {
    it("Create user with an existing email ==> KO", async () => {
      await userController.createUser(new RegisterUserReq(emailValid));
      try {
        await userController.createUser(new RegisterUserReq(emailValid));
      } catch (error) {
        expect(error).toBeInstanceOf(UserAlreadyExistsException);
      }
    });
  });
});
