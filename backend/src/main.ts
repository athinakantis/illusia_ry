import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve React static files
  app.useStaticAssets(join(__dirname, '..', 'frontend'));
  app.setBaseViewsDir(join(__dirname, '..', 'frontend'));

  // Enable CORS for local React development
  app.enableCors({
    origin: true, // Allow all origins for local development
    // origin: process.env.CORS_ORIGIN, // Uncomment this line for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  // Add PORT to env when running in production
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
