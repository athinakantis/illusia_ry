import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SupabaseTokenInterceptor } from './middlewares/supabase-token.interceptor';
import rateLimit from 'express-rate-limit'; // https://www.npmjs.com/package/express-rate-limit
// We can also look into: https://docs.nestjs.com/security/rate-limiting
import { SupabaseService } from './services/supabase.service';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve React static files
  app.useStaticAssets(join(__dirname, '..', 'frontend'));
  app.setBaseViewsDir(join(__dirname, '..', 'frontend'));
 
  app.useGlobalInterceptors(new SupabaseTokenInterceptor(
    app.get(SupabaseService) // make sure SupabaseService is provided
  ));

  // Enable CORS for local React development
  app.enableCors({
    origin: true, // Allow all origins for local development
    // origin: process.env.CORS_ORIGIN, // Uncomment this line for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Rate limiting to protect against brute-force attacks.
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  // Add PORT to env when running in production
  const port = process.env.PORT || 5001;
  await app.listen(port);
}
bootstrap();
