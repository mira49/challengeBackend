import { Module, DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ConfigModule from './config.module';
import ConfigService from './config.service';
import DomainModule from '../domain/domain.module';

const dbUri = 'MONGO_SERVER_URL';
const dbPort = 'MONGO_SERVER_PORT';
const dbName = 'MONGO_SERVER_DBNAME';

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
              configService.get(dbPort)}/${configService.get(dbName)}`,
          }),
          inject: [ConfigService],
        })
      ],
    };
  }
}
