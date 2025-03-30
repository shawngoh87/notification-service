import { Injectable } from '@nestjs/common';
import { NotificationType } from '../domain/types';
import { IdentityRemoteService } from '../infra/remote-service/identity.remote-service';
import { NotificationTemplateRegistry } from './notification-template.registry';
import { NotificationChannelRegistry } from './notification-channel.registry';

type SendNotificationResult = {
  sent: boolean;
  skipReason: 'user_not_found' | 'unsubscribed' | null;
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

    for (const channel of supportedChannels) {
      if (user.isSubscribedToChannel(channel)) {
        const content = template.getContent(channel, {
          userName: user.name,
          companyName: user.company.name,
        });
        // TODO: batch send after content is ready
        await this.channelRegistry.getByChannelType(channel).send(content);
      }
    }

    return {
      sent: true,
      skipReason: null,
    };
  }
}
