import { Company } from './company.entity';
import { ChannelSubscription, NotificationChannelType } from './types';

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly company: Company,
    public readonly channelSubscription: ChannelSubscription,
  ) {}

  static create(params: {
    id: string;
    name: string;
    company: {
      id: string;
      name: string;
      channelSubscription: ChannelSubscription;
    };
    channelSubscription: ChannelSubscription;
  }): User {
    return new User(
      params.id,
      params.name,
      Company.create(params.company),
      params.channelSubscription,
    );
  }

  isSubscribedToChannel(channel: NotificationChannelType): boolean {
    return this.channelSubscription[channel];
  }
}
