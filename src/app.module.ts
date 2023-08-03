import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { USerController } from './controllers/login.controller';
import UserService from './services/user.service';

@Module({
  imports: [],
  controllers: [AppController, USerController],
  providers: [AppService, UserService],
})
export class AppModule {}
