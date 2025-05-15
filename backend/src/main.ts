import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './modules/app/app.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve React static files
  app.useStaticAssets(join(__dirname, '..', 'frontend'));
  app.setBaseViewsDir(join(__dirname, '..', 'frontend'));
  //Ensures that invalid payloads are rejected with 404 error
  // Extra, unvalidated properties will be removed from the payload
  app.useGlobalPipes(new ValidationPipe({ whitelist: true,forbidNonWhitelisted: true })); 

  // Enable CORS for local React development
  app.enableCors({
    origin: true, // Allow all origins for local development
    // origin: process.env.CORS_ORIGIN, // Uncomment this line for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  // Add PORT to env when running in production
  const port = process.env.PORT || 5001;
  await app.listen(port);
}
bootstrap();
