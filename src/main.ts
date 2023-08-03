import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from "@nestjs/platform-express/interfaces";
import helmet from 'helmet';
import mongoose from 'mongoose';

import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(__dirname, "../.env") });

function setMongoConfig() {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.BD!, {}).then(v => {
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
