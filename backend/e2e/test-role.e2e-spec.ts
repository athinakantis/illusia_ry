import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { TestRoleController } from '../src/controllers/test-role.controller';
import { SupabaseRoleService } from '../src/services/supabase-role.service'; 

describe('TestRoleController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()], // <-- Add this line
      controllers: [TestRoleController],
      providers: [SupabaseRoleService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch public admins', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-role/admins')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'Successfully fetched public admins!');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0); // Should pass if there are admins in the database
    expect(response.body.data[0]).toHaveProperty('admin_id'); 
    expect(response.body.data[0]).toHaveProperty('user_id');
    expect(response.body.data[0]).toHaveProperty('role');
    expect(response.body.data[0]).toHaveProperty('display_name');
  });

  it('should fetch public users', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-role/users')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'Successfully fetched public users!');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0); // Should pass if there are users in the database
    expect(response.body.data[0]).toHaveProperty('user_id'); 
    expect(response.body.data[0]).toHaveProperty('role');
    expect(response.body.data[0]).toHaveProperty('email');
    expect(response.body.data[0]).toHaveProperty('approved_status');
    expect(response.body.data[0]).toHaveProperty('display_name');
  });
});