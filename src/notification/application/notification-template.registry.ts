import { Injectable } from '@nestjs/common';
import { NotificationType } from '../domain/types';
import { NotificationTemplate } from './notification-template/notification-template.interface';

class TemplateNotFoundException extends Error {
  constructor(notificationType: NotificationType) {
    super(`Template for notification type ${notificationType} not found`);
  }
}

@Injectable()
export class NotificationTemplateRegistry {
  static readonly TemplateNotFoundException = TemplateNotFoundException;

  private templates: Map<NotificationType, NotificationTemplate> = new Map();

  register(notificationType: NotificationType, template: NotificationTemplate) {
    this.templates.set(notificationType, template);
  }

  getByNotificationType(
    notificationType: NotificationType,
  ): NotificationTemplate {
    const template = this.templates.get(notificationType);

    if (!template) {
      throw new NotificationTemplateRegistry.TemplateNotFoundException(
        notificationType,
      );
    }

    return template;
  }
}
