import { Test, TestingModule } from '@nestjs/testing';
import { UINotificationChannel } from './ui';
import { UINotificationRepository } from '../../infra/repository/ui-notification.repository';

describe('UINotificationChannel', () => {
  let channel: UINotificationChannel;
  let mockedUINotificationRepository: jest.Mocked<UINotificationRepository>;
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
    mockedUINotificationRepository = module.get<
      jest.Mocked<UINotificationRepository>
    >(UINotificationRepository);
  });

  describe('send', () => {
    it('should send a notification', async () => {
      await channel.send({
        companyId: '1',
        userId: '1',
        content: 'Test',
      });

      expect(mockedUINotificationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          companyId: '1',
          userId: '1',
          content: 'Test',
        }),
      );
    });
  });
});
