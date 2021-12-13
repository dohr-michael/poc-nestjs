import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { MongoModule } from '~/tools/mongo';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [ AppController ],
      providers: [ MongoModule ],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.health()).toBe({ 'status': 'ok' });
    });
  });
});
