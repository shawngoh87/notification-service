import { Injectable } from '@nestjs/common';
import { NotificationChannelType } from '../domain/types';
import { NotificationChannel } from './channel/notification-channel.interface';

class ChannelNotFoundException extends Error {
  constructor(channelType: NotificationChannelType) {
    super(`Channel ${channelType} not found`);
  }
}

@Injectable()
export class ChannelRegistry {
  static readonly ChannelNotFoundException = ChannelNotFoundException;

  private channels: Map<NotificationChannelType, NotificationChannel> =
    new Map();

  register(channelType: NotificationChannelType, channel: NotificationChannel) {
    this.channels.set(channelType, channel);
  }

  getByChannelType(channelType: NotificationChannelType): NotificationChannel {
    const channel = this.channels.get(channelType);

    if (!channel) {
      throw new ChannelRegistry.ChannelNotFoundException(channelType);
    }

    return channel;
  }
}
