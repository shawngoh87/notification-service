import { Injectable } from '@nestjs/common';
import { NotificationType } from '../domain/types';
import { NotificationTemplate } from '../domain/template.interface';

class TemplateNotFoundException extends Error {
  constructor(notificationType: NotificationType) {
    super(`Template for notification type ${notificationType} not found`);
  }
}

@Injectable()
export class TemplateRegistry {
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
      throw new TemplateRegistry.TemplateNotFoundException(notificationType);
    }

    return template;
  }
}
