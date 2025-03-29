import { NotificationType } from './types';

type NotificationProps = {
  id: string;
  type: NotificationType;
  data: Record<string, any>;
};

export class Notification {
  id: string;
  type: NotificationType;
  data: Record<string, any>;

  constructor(props: NotificationProps) {
    this.id = props.id;
    this.type = props.type;
    this.data = props.data;
  }
}
