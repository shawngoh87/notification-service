import { ChannelSubscription, NotificationChannelType } from './types';

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly channelSubscription: ChannelSubscription,
  ) {}

  static create(params: {
    id: string;
    name: string;
    channelSubscription: ChannelSubscription;
  }): Company {
    return new Company(params.id, params.name, params.channelSubscription);
  }

  isSubscribedToChannel(channel: NotificationChannelType): boolean {
    return this.channelSubscription[channel];
  }
}
