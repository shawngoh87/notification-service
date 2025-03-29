import { v4 as uuidv4 } from 'uuid';
import { NotificationChannelType, NotificationType } from './types';

class UnsupportedNotificationTypeException extends Error {
  constructor(type: any) {
    super(`Unsupported notification type: ${type}`);
  }
}

type NotificationProps = {
  id: string;
  type: NotificationType;
  data: Record<string, any>;
};

type NotificationCreateProps = Omit<NotificationProps, 'id'>;

export class Notification {
  static readonly UnsupportedNotificationTypeException =
    UnsupportedNotificationTypeException;

  id: string;
  type: NotificationType;
  data: Record<string, any>;

  constructor(props: NotificationProps) {
    this.id = props.id;
    this.type = props.type;
    this.data = props.data;
  }

  static create(props: NotificationCreateProps): Notification {
    return new Notification({ id: uuidv4(), ...props });
  }

  getChannels(): NotificationChannelType[] {
    switch (this.type) {
      case NotificationType.LeaveBalanceReminder:
        return [NotificationChannelType.UI];
      case NotificationType.MonthlyPayslip:
        return [NotificationChannelType.Email];
      case NotificationType.HappyBirthday:
        return [NotificationChannelType.UI, NotificationChannelType.Email];
      default:
        throw new Notification.UnsupportedNotificationTypeException(this.type);
    }
  }
}
