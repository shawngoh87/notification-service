import { Injectable } from '@nestjs/common';

export const NotificationChannelType = {
  Email: 'email',
  UI: 'ui',
} as const;

export type NotificationChannelType =
  (typeof NotificationChannelType)[keyof typeof NotificationChannelType];

type ChannelSubscription = {
  [key in NotificationChannelType]: boolean;
};

type IdentityUser = {
  id: string;
  name: string;
  company: {
    id: string;
    name: string;
    channelSubscription: ChannelSubscription;
  };
  channelSubscription: ChannelSubscription;
};

@Injectable()
export class IdentityService {
  private readonly users: IdentityUser[] = [
    {
      id: '1',
      name: 'John Doe',
      company: {
        id: '1',
        name: 'Acme Corp',
        channelSubscription: {
          email: true,
          ui: true,
        },
      },
      channelSubscription: {
        email: true,
        ui: true,
      },
    },
    {
      id: '2',
      name: 'Jane Smith',
      company: {
        id: '2',
        name: 'Globex Industries',
        channelSubscription: {
          email: true,
          ui: false,
        },
      },
      channelSubscription: {
        email: true,
        ui: false,
      },
    },
    {
      id: '3',
      name: 'Bob Wilson',
      company: {
        id: '3',
        name: 'Initech',
        channelSubscription: {
          email: false,
          ui: true,
        },
      },
      channelSubscription: {
        email: false,
        ui: true,
      },
    },
  ];

  async getUser(params: {
    userId: string;
    companyId: string;
  }): Promise<IdentityUser | null> {
    const user = this.users.find((user) => user.id === params.userId);

    if (!user) {
      return null;
    }

    const company = user.company.id === params.companyId;

    if (!company) {
      return null;
    }

    return Promise.resolve(user);
  }
}
