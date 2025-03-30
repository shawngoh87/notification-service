import { NotificationTemplate } from './template.interface';
import { NotificationChannelType } from './types';

class UnsupportedChannelException extends Error {
  constructor(channel: NotificationChannelType) {
    super(`Unsupported channel: ${channel}`);
  }
}

export class LeaveBalanceReminderTemplate implements NotificationTemplate {
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
