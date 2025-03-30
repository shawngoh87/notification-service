import { Test, TestingModule } from '@nestjs/testing';
import { LeaveBalanceReminderNotificationTemplate } from './leave-balance-reminder';
import { NotificationChannelType } from '../../domain/types';

describe('LeaveBalanceReminderNotificationTemplate', () => {
  let template: LeaveBalanceReminderNotificationTemplate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeaveBalanceReminderNotificationTemplate],
    }).compile();

    template = module.get<LeaveBalanceReminderNotificationTemplate>(
      LeaveBalanceReminderNotificationTemplate,
    );
  });

  describe('getSupportedChannels', () => {
    it('should return the supported channels', () => {
      const channels = template.getSupportedChannels();
      expect(channels).toEqual([NotificationChannelType.UI]);
    });
  });

  describe('getContent', () => {
    it('should return the ui content', () => {
      const content = template.getContent(NotificationChannelType.UI, {
        userName: 'John Doe',
      });
      expect(content).toEqual({
        content: 'Remember to book your leaves, John Doe',
      });
    });

    it('should throw an error if the channel is not supported', () => {
      expect(() =>
        template.getContent(NotificationChannelType.Email, {}),
      ).toThrow();
    });
  });
});
