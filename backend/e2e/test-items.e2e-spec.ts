import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as request from 'supertest';
import { TestItemController } from '../src/controllers/item.controller';
import { ItemService } from '../src/services/items.service';


describe('TestItemController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()], // <-- Add this line
      controllers: [TestItemController],
      providers: [ItemService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should fetch items', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-items/items')
      .expect(200);
      expect(response.body).toHaveProperty('status', 'Successfully fetched items!');
      expect(response.body.data).toHaveLength(3)
      expect(response.body.data[0]).toHaveProperty('category_id')
      expect(response.body.data[0]).toHaveProperty('created_at')
      expect(response.body.data[0]).toHaveProperty('description')
      expect(response.body.data[0]).toHaveProperty('image_path')
      expect(response.body.data[0]).toHaveProperty('item_id')
      expect(response.body.data[0]).toHaveProperty('item_name')
      expect(response.body.data[0]).toHaveProperty('quantity')
  });
});