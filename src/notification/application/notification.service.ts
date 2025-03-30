import { Injectable } from '@nestjs/common';
import { NotificationType, NotificationChannelType } from '../domain/types';
import { IdentityRemoteService } from '../infra/remote-service/identity.remote-service';
import { NotificationTemplateRegistry } from './notification-template/notification-template.registry';
import { NotificationChannelRegistry } from './notification-channel/notification-channel.registry';
import { UINotification } from '../domain/entity/ui-notification.entity';

type SendNotificationResult = {
  sent: boolean;
  skipReason: 'user_not_found' | null;
};

@Injectable()
export class NotificationService {
  constructor(
    private readonly identityRemoteService: IdentityRemoteService,
    private readonly templateRegistry: NotificationTemplateRegistry,
    private readonly channelRegistry: NotificationChannelRegistry,
  ) {}

  async sendNotification(params: {
    companyId: string;
    userId: string;
    notificationType: NotificationType;
  }): Promise<SendNotificationResult> {
    const user = await this.identityRemoteService.getUser({
      userId: params.userId,
      companyId: params.companyId,
    });

    // User might be deleted, skip sending but notify service caller
    if (!user) {
      return {
        sent: false,
        skipReason: 'user_not_found',
      };
    }

    const template = this.templateRegistry.getByNotificationType(
      params.notificationType,
    );

    const supportedChannels = template.getSupportedChannels();
    const dataToSend: {
      channel: NotificationChannelType;
      content: any;
    }[] = [];

    for (const channel of supportedChannels) {
      if (user.isSubscribedToChannel(channel)) {
        const content = template.getContent(channel, {
          userName: user.name,
          companyName: user.company.name,
        });
        dataToSend.push({
          channel,
          content,
        });
      }
    }

    for (const data of dataToSend) {
      await this.channelRegistry
        .getByChannelType(data.channel)
        .send(data.content);
    }

    return {
      sent: true,
      skipReason: null,
    };
  }

  async listUiNotifications(params: {
    companyId: string;
    userId: string;
  }): Promise<UINotification[]> {
    return await Promise.resolve([]);
  }
}
