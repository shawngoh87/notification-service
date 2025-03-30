import { Test, TestingModule } from '@nestjs/testing';
import { EmailNotificationChannel } from './email';

describe('EmailNotificationChannel', () => {
  let channel: EmailNotificationChannel;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailNotificationChannel],
    }).compile();

    jest.spyOn(console, 'log').mockImplementation(() => {});

    channel = module.get<EmailNotificationChannel>(EmailNotificationChannel);
  });

  describe('send', () => {
    it('should send a notification', async () => {
      await channel.send({
        subject: 'Test',
        content: 'Test',
      });

      expect(console.log).toHaveBeenCalledWith('Subject', 'Test');
      expect(console.log).toHaveBeenCalledWith('Content', 'Test');
    });
  });
});
