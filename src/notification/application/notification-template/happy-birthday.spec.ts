import { Test, TestingModule } from '@nestjs/testing';
import { HappyBirthdayNotificationTemplate } from './happy-birthday';
import { NotificationChannelType } from '../../domain/types';

describe('HappyBirthdayNotificationTemplate', () => {
  let template: HappyBirthdayNotificationTemplate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HappyBirthdayNotificationTemplate],
    }).compile();

    template = module.get<HappyBirthdayNotificationTemplate>(
      HappyBirthdayNotificationTemplate,
    );
  });

  describe('getSupportedChannels', () => {
    it('should return the supported channels', () => {
      const channels = template.getSupportedChannels();
      expect(channels).toEqual([
        NotificationChannelType.Email,
        NotificationChannelType.UI,
      ]);
    });
  });

  describe('getContent', () => {
    it('should return the UI content', () => {
      const content = template.getContent(NotificationChannelType.UI, {
        companyName: 'Acme',
        userName: 'John Doe',
      });
      expect(content).toEqual({
        content: 'Acme wishes you a happy birthday, John Doe!',
      });
    });

    it('should return the email content', () => {
      const content = template.getContent(NotificationChannelType.Email, {
        companyName: 'Acme',
        userName: 'John Doe',
      });

      expect(content).toEqual({
        subject: 'Happy Birthday, John Doe',
        content: 'Acme wishes you a happy birthday, John Doe!',
      });
    });

    it('should throw an error if the channel is not supported', () => {
      expect(() =>
        template.getContent(
          'some future channel' as NotificationChannelType,
          {},
        ),
      ).toThrow();
    });
  });
});
