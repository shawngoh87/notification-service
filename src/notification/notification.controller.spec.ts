import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { AppService } from 'src/app.service';

describe('AppController', () => {
  let appController: NotificationController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [AppService],
    }).compile();

    appController = app.get<NotificationController>(NotificationController);
  });

  describe('root', () => {
    it('should return "Hello test"', async () => {
      expect(await appController.test()).toBe('Hello test');
    });
  });
});
