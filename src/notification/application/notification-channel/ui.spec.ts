import { Test, TestingModule } from '@nestjs/testing';
import { UINotificationChannel } from './ui';
import { UINotificationRepository } from '../../infra/repository/ui-notification.repository';

describe('UINotificationChannel', () => {
  let channel: UINotificationChannel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UINotificationChannel,
        {
          provide: UINotificationRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    channel = module.get<UINotificationChannel>(UINotificationChannel);
  });

  describe('send', () => {
    it('should send a notification', async () => {
      await channel.send({
        content: 'Test',
      });
    });
  });
});
