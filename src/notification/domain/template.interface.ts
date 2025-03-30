import { NotificationChannelType, NotificationContent } from './types';

export interface NotificationTemplate {
  getSupportedChannels(): NotificationChannelType[];

  getContent(
    channel: NotificationChannelType,
    params: Record<string, any>,
  ): NotificationContent;
}
