import { ChannelSubscription } from '../types';

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

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      channelSubscription: this.channelSubscription,
    };
  }
}
