import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { getConnectionToken, MongooseModule } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import ConfigModule from "../../src/data/config.module";
import ConfigService from "../../src/data/config.service";
import EventSchema from "../../src/data/entity/event/event.schema";
import UserSchema from "../../src/data/entity/user/user.schema";
import EventRepositoryMongo from "../../src/data/repository/event.repository.mongo";
import UserRepositoryMongo from "../../src/data/repository/user.repository.mongo";
import DomainModule from "../../src/domain/domain.module";
import UserService from "../../src/domain/services/user.service";
import UserController from "../../src/web.api/user/user.controller";
import CreateConsentsReq from "../../src/web.api/event/entities/CreateConsentsReq";
import EventService from "../../src/domain/services/event.service";
import EventController from "../../src/web.api/event/event.controller";
import { ConsentType } from "../../src/web.api/event/entities/EventVM";

const dbUri = "MONGO_SERVER_URL";
const dbPort = "MONGO_SERVER_PORT";
const dbName = "MONGO_SERVER_DBNAME";
const fs = require("fs");

describe("UserController & EventController (e2e)", () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  afterEach(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
  });

  it("User choose no consent then he choose sms", async done => {
    const rawdata = fs.readFileSync(`${__dirname}/createUser.json`);

    const responseCreate = await request(app.getHttpServer())
      .post("/api/v1/users/")
      .send(JSON.parse(rawdata));

    let response = await request(app.getHttpServer())
      .post(`/api/v1/events/`)
      .send(new CreateConsentsReq(responseCreate.body.id, false, false));

    expect(response.status).toBe(201);
    expect(response.body.user.id).toBe(responseCreate.body.id);
    expect(response.body.consents).toStrictEqual([]);

    response = await request(app.getHttpServer())
      .post(`/api/v1/events/`)
      .send(new CreateConsentsReq(responseCreate.body.id, false, true));

    expect(response.status).toBe(201);
    expect(response.body.user.id).toBe(responseCreate.body.id);
    expect(response.body.consents.length).toBe(1);
    expect(response.body.consents[0].id).toBe(ConsentType.sms);
    expect(response.body.consents[0].enabled).toBe(true);
    done();
  });

  it("User choose email then he choose no consent", async done => {
    const rawdata = fs.readFileSync(`${__dirname}/createUser.json`);

    const responseCreate = await request(app.getHttpServer())
      .post("/api/v1/users/")
      .send(JSON.parse(rawdata));

    let response = await request(app.getHttpServer())
      .post(`/api/v1/events/`)
      .send(new CreateConsentsReq(responseCreate.body.id, true, false));

    expect(response.status).toBe(201);
    expect(response.body.user.id).toBe(responseCreate.body.id);
    expect(response.body.consents.length).toBe(1);
    expect(response.body.consents[0].id).toBe(ConsentType.email);
    expect(response.body.consents[0].enabled).toBe(true);

    response = await request(app.getHttpServer())
      .post(`/api/v1/events/`)
      .send(new CreateConsentsReq(responseCreate.body.id, false, false));

    expect(response.status).toBe(201);
    expect(response.body.user.id).toBe(responseCreate.body.id);
    expect(response.body.consents.length).toBe(1);
    expect(response.body.consents[0].id).toBe(ConsentType.email);
    expect(response.body.consents[0].enabled).toBe(false);
    done();
  });

  it("User choose email ans sms then he choose sms", async done => {
    const rawdata = fs.readFileSync(`${__dirname}/createUser.json`);

    const responseCreate = await request(app.getHttpServer())
      .post("/api/v1/users/")
      .send(JSON.parse(rawdata));

    let response = await request(app.getHttpServer())
      .post(`/api/v1/events/`)
      .send(new CreateConsentsReq(responseCreate.body.id, true, true));

    expect(response.status).toBe(201);
    expect(response.body.user.id).toBe(responseCreate.body.id);
    expect(response.body.consents.length).toBe(2);
    expect(response.body.consents[0].id).toBe(ConsentType.email);
    expect(response.body.consents[0].enabled).toBe(true);
    expect(response.body.consents[1].id).toBe(ConsentType.sms);
    expect(response.body.consents[1].enabled).toBe(true);

    response = await request(app.getHttpServer())
      .post(`/api/v1/events/`)
      .send(new CreateConsentsReq(responseCreate.body.id, false, true));

    expect(response.status).toBe(201);
    expect(response.body.user.id).toBe(responseCreate.body.id);
    expect(response.body.consents.length).toBe(3);
    expect(response.body.consents[0].id).toBe(ConsentType.email);
    expect(response.body.consents[0].enabled).toBe(false);
    expect(response.body.consents[1].id).toBe(ConsentType.sms);
    expect(response.body.consents[1].enabled).toBe(false);
    expect(response.body.consents[2].id).toBe(ConsentType.sms);
    expect(response.body.consents[2].enabled).toBe(true);
    done();
  });

  beforeEach(async done => {
    moduleFixture = await Test.createTestingModule({
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

    app = moduleFixture.createNestApplication();
    await app.init();
    done();
  });
});
