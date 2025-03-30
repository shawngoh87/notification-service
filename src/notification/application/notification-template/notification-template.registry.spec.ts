import { Test, TestingModule } from '@nestjs/testing';
import { NotificationType } from '../../domain/types';
import { NotificationTemplateRegistry } from './notification-template.registry';

describe('NotificationTemplateRegistry', () => {
  let registry: NotificationTemplateRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationTemplateRegistry],
    }).compile();

    registry = module.get<NotificationTemplateRegistry>(
      NotificationTemplateRegistry,
    );
  });

  describe('register', () => {
    it('should register a channel', () => {
      const template = {
        getSupportedChannels: jest.fn(),
        getContent: jest.fn(),
      };

      const template2 = {
        getSupportedChannels: jest.fn(),
        getContent: jest.fn(),
      };

      registry.register(NotificationType.LeaveBalanceReminder, template);
      registry.register(NotificationType.HappyBirthday, template2);

      expect(
        registry.getByNotificationType(NotificationType.LeaveBalanceReminder),
      ).toEqual(template);

      expect(
        registry.getByNotificationType(NotificationType.HappyBirthday),
      ).toEqual(template2);
    });
  });
});
