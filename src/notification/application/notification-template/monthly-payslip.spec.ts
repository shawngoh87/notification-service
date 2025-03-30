import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyPayslipNotificationTemplate } from './monthly-payslip';
import { NotificationChannelType } from '../../domain/types';

describe('MonthlyPayslipNotificationTemplate', () => {
  let template: MonthlyPayslipNotificationTemplate;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyPayslipNotificationTemplate],
    }).compile();

    template = module.get<MonthlyPayslipNotificationTemplate>(
      MonthlyPayslipNotificationTemplate,
    );
  });

  describe('getSupportedChannels', () => {
    it('should return the supported channels', () => {
      const channels = template.getSupportedChannels();
      expect(channels).toEqual([NotificationChannelType.Email]);
    });
  });

  describe('getContent', () => {
    it('should return the email content', () => {
      const content = template.getContent(NotificationChannelType.Email, {
        userName: 'John Doe',
      });
      expect(content).toEqual({
        subject: 'Your monthly payslip is ready',
        content: 'Your monthly payslip is ready, John Doe',
      });
    });

    it('should throw an error if the channel is not supported', () => {
      expect(() =>
        template.getContent(NotificationChannelType.UI, {}),
      ).toThrow();
    });
  });
});
