import { NotificationTemplate } from './notification-template.interface';
import { NotificationChannelType } from '../../domain/types';

class UnsupportedChannelException extends Error {
  constructor(channel: NotificationChannelType) {
    super(`Unsupported channel: ${channel}`);
  }
}

export class MonthlyPayslipNotificationTemplate
  implements NotificationTemplate
{
  getSupportedChannels(): NotificationChannelType[] {
    return [NotificationChannelType.Email];
  }

  getContent(channel: NotificationChannelType, params: Record<string, any>) {
    switch (channel) {
      case NotificationChannelType.Email:
        return {
          // TODO: Figure out how to enforce type safety for payload
          subject: 'Your monthly payslip is ready',
          content: `Your monthly payslip is ready, ${params.userName}`,
        };
      default:
        throw new UnsupportedChannelException(channel);
    }
  }
}
