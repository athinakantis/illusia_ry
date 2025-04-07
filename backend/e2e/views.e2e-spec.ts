import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

describe('ViewsController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
      throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env file');
    }
    if (!process.env.SUPABASE_ANON_KEY || !process.env.SUPABASE_URL) {
      throw new Error('SUPABASE_ANON_KEY or SUPABASE_URL must be set in .env file');
    }

    const loginRes = await request(process.env.SUPABASE_URL)
      .post('/auth/v1/token?grant_type=password')
      .set('apikey', process.env.SUPABASE_ANON_KEY)
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD,
      });

    token = loginRes.body.access_token;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /views/frontend-items - should return item view data', async () => {
    const res = await request(app.getHttpServer())
      .get('/views/frontend-items')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message', 'Successfully fetched frontend item view');
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});