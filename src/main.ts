import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express/interfaces";
import helmet from 'helmet';
import mongoose from 'mongoose';

function setMongoConfig() {
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb+srv://hylia:HyliaNote2023@cluster0.yxlgdrq.mongodb.net/?retryWrites=true&w=majority', {}).then(v => {
    console.log('bd connected')
  }).catch((reason: any) => {
    console.log(reason.message)
  })
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(helmet());
  setMongoConfig();
  await app.listen(3000);
}

bootstrap();
