import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import UserService from './services/user.service';
import UserSchema from '../data/entity/user/user.schema';
import UserRepositoryMongo from '../data/repository/user.repository.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserRepositoryMongo,
    }
  ],
  exports: [UserService],
})
export default class DomainModule {}
