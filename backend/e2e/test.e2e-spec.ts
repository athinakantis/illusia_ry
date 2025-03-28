import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; 

describe('TestController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/test/supabase (GET)', () => {
    return request(app.getHttpServer())
      .get('/test/supabase')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('status', 'Connected to Supabase!');
        expect(res.body).toHaveProperty('data');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});