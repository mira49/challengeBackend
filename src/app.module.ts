import { Module, DynamicModule } from "@nestjs/common";
import DomainModule from "./domain/domain.module";
import DataModule from "./data/data.module";
import WebApiModule from "./web.api/web.api.module";

@Module({})
export default class AppModule {
  static foorRoot(setting: any): DynamicModule {
    return {
      module: AppModule,
      imports: [DataModule.foorRoot(setting), DomainModule, WebApiModule]
    };
  }
}
