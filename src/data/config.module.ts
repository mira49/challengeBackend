import { Module } from "@nestjs/common";
import ConfigService from "./config.service";

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        `./environnement/${process.env.NODE_ENV || "development"}.env`
      )
    }
  ],
  exports: [ConfigService]
})
export default class ConfigModule {}
