import { Module, DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import ConfigModule from "./config.module";
import ConfigService from "./config.service";
import UserSchema from "./entity/user/user.schema";
import DomainModule from "../domain/domain.module";
import EventSchema from "./entity/event/event.schema";

const dbUri = "MONGO_SERVER_URL";
const dbPort = "MONGO_SERVER_PORT";
const dbName = "MONGO_SERVER_DBNAME";

@Module({})
export default class DataModule {
  static foorRoot(setting: any): DynamicModule {
    return {
      module: DataModule,
      imports: [
        DomainModule,
        MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            uri: `mongodb://${configService.get(dbUri)}:${setting.port ||
              configService.get(dbPort)}/${configService.get(dbName)}`
          }),
          inject: [ConfigService]
        }),
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
        MongooseModule.forFeature([{ name: "Event", schema: EventSchema }])
      ]
    };
  }
}
