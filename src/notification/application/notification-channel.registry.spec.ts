import { Test, TestingModule } from '@nestjs/testing';
import { NotificationChannelType } from '../domain/types';
import { NotificationChannelRegistry } from './notification-channel.registry';

describe('NotificationChannelRegistry', () => {
  let registry: NotificationChannelRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationChannelRegistry],
    }).compile();

    registry = module.get<NotificationChannelRegistry>(
      NotificationChannelRegistry,
    );
  });

  describe('register', () => {
    it('should register a channel', () => {
      const channel = {
        send: jest.fn(),
      };

      const channel2 = {
        send: jest.fn(),
      };

      registry.register(NotificationChannelType.UI, channel);
      registry.register(NotificationChannelType.Email, channel2);

      expect(registry.getByChannelType(NotificationChannelType.UI)).toEqual(
        channel,
      );

      expect(registry.getByChannelType(NotificationChannelType.Email)).toEqual(
        channel2,
      );
    });
  });
});
