import {
  NotificationChannelType,
  NotificationContent,
} from '../../domain/types';

export interface NotificationTemplate {
  getSupportedChannels(): NotificationChannelType[];

  getContent(
    channel: NotificationChannelType,
    params: Record<string, any>,
  ): NotificationContent;
}
