import { Injectable } from '@nestjs/common';
import { NotificationType, NotificationChannelType } from '../domain/types';
import { IdentityRemoteService } from '../infra/remote-service/identity.remote-service';
import { NotificationTemplateRegistry } from './notification-template/notification-template.registry';
import { NotificationChannelRegistry } from './notification-channel/notification-channel.registry';
import { UINotification } from '../domain/entity/ui-notification.entity';
import { UINotificationRepository } from '../infra/repository/ui-notification.repository';

class UserNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

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
    private readonly uiNotificationRepository: UINotificationRepository,
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
      content: unknown;
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
      await this.channelRegistry.getByChannelType(data.channel).send({
        companyId: params.companyId,
        userId: params.userId,
        data: data.content,
      });
    }

    return {
      sent: true,
      skipReason: null,
    };
  }

  async listUINotifications(params: {
    companyId: string;
    userId: string;
  }): Promise<UINotification[]> {
    const user = await this.identityRemoteService.getUser({
      userId: params.userId,
      companyId: params.companyId,
    });

    if (!user) {
      throw new UserNotFoundException(
        `User not found for userId: ${params.userId}, companyId: ${params.companyId}`,
      );
    }

    const uiNotifications = await this.uiNotificationRepository.listByUserId({
      companyId: params.companyId,
      userId: params.userId,
    });

    return uiNotifications;
  }
}
