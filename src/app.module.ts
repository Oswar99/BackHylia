import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { USerController } from './controllers/user.controller';
import UserService from './services/user.service';
import { LoggerMiddleware } from './helpers/loggerMiddleware.helper';
import { ProjectController } from './controllers/project.controller';
import ProjectService from './services/project.service';

@Module({
  imports: [],
  controllers: [AppController, USerController, ProjectController],
  providers: [AppService, UserService, ProjectService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('project', 'share', 'users', 'follow')
  }
}
