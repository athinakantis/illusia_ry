import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

describe('ItemController (e2e)', () => {
  let app: INestApplication;
  let createdItemId: string;
let token: string;


beforeAll(async () => {
if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
    throw new Error('TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env file');
}
  if (!process.env.SUPABASE_ANON_KEY|| !process.env.SUPABASE_URL) {
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
});
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const itemPayload = {
    item_name: 'E2E Test Item',
    description: 'This is a test item',
    image_path: '/images/test.jpg',
    location: 'Test City',
    quantity: 10,
    category_id: '16f1ae21-1c71-4086-90ad-8331e120a8c3',
  };

  it('POST /items - should create an item', async () => {
    const res = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${token}`)
      .send(itemPayload)
      .expect(201);
      if (!Array.isArray(res.body.data) || !res.body.data[0]?.item_id) {
        throw new Error(`Unexpected response body from POST /items: ${JSON.stringify(res.body)}`);
      }
      
      createdItemId = res.body.data[0].item_id;
    expect(res.body).toHaveProperty('message', 'Item added successfully');
    expect(res.body.data).toBeDefined();
    expect(Array.isArray(res.body.data)).toBe(true);
  

    expect(createdItemId).toBeDefined(); // ✅ ensure this fails early if undefined
  });

  it('GET /items - should return all items', async () => {
    const res = await request(app.getHttpServer())
      .get('/items')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
      expect(res.body).toHaveProperty('message', 'Items retrieved successfully');
      
    /*   expect(res.body.data[0]).toHaveProperty('category_id')
      expect(res.body.data[0]).toHaveProperty('created_at')
      expect(res.body.data[0]).toHaveProperty('description')
      expect(res.body.data[0]).toHaveProperty('image_path')
      expect(res.body.data[0]).toHaveProperty('item_id')
      expect(res.body.data[0]).toHaveProperty('item_name')
      expect(res.body.data[0]).toHaveProperty('quantity') */
    expect(res.body).toHaveProperty('message');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('PATCH /items/:id - should update the created item', async () => {
    if (!createdItemId) {
      throw new Error('No item ID available to update — was POST test successful?');
    }
  
    const res = await request(app.getHttpServer())
      .patch(`/items/${createdItemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 99 })
      .expect(200);
  
    expect(res.body).toHaveProperty('message', `Item: ${createdItemId} updated successfully`);
  });

  it('DELETE /items/:id - should delete the created item', async () => {
    if (!createdItemId) {
      throw new Error('No item ID available to delete — was POST test successful?');
    }
    const res = await request(app.getHttpServer())
      .delete(`/items/${createdItemId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('message');
  });
});