import { NotificationTemplate } from './notification-template.interface';
import { NotificationChannelType } from '../../domain/types';

class UnsupportedChannelException extends Error {
  constructor(channel: NotificationChannelType) {
    super(`Unsupported channel: ${channel}`);
  }
}

export class LeaveBalanceReminderNotificationTemplate
  implements NotificationTemplate
{
  getSupportedChannels(): NotificationChannelType[] {
    return [NotificationChannelType.UI];
  }

  getContent(channel: NotificationChannelType, params: Record<string, any>) {
    switch (channel) {
      case NotificationChannelType.UI:
        return {
          content: `Remember to book your leaves, ${params.userName}`,
        };
      default:
        throw new UnsupportedChannelException(channel);
    }
  }
}
