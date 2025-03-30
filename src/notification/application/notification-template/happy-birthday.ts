import { NotificationTemplate } from './notification-template.interface';
import { NotificationChannelType } from '../../domain/types';

class UnsupportedChannelException extends Error {
  constructor(channel: NotificationChannelType) {
    super(`Unsupported channel: ${channel}`);
  }
}

export class HappyBirthdayNotificationTemplate implements NotificationTemplate {
  getSupportedChannels(): NotificationChannelType[] {
    return [NotificationChannelType.Email, NotificationChannelType.UI];
  }

  getContent(channel: NotificationChannelType, params: Record<string, any>) {
    switch (channel) {
      case NotificationChannelType.UI:
        return {
          content: `${params.companyName} wishes you a happy birthday, ${params.userName}!`,
        };
      case NotificationChannelType.Email:
        return {
          subject: `Happy Birthday, ${params.userName}`,
          content: `${params.companyName} wishes you a happy birthday, ${params.userName}!`,
        };
      default:
        throw new UnsupportedChannelException(channel);
    }
  }
}
