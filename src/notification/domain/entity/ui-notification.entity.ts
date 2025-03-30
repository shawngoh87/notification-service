import { v4 as uuidv4 } from 'uuid';

export class UINotification {
  private id: string;
  private content: string;
  private companyId: string;
  private userId: string;

  constructor(props: {
    id: string;
    content: string;
    companyId: string;
    userId: string;
  }) {
    this.id = props.id;
    this.content = props.content;
    this.companyId = props.companyId;
    this.userId = props.userId;
  }

  static create(props: {
    content: string;
    companyId: string;
    userId: string;
  }): UINotification {
    return new UINotification({
      id: uuidv4(),
      content: props.content,
      companyId: props.companyId,
      userId: props.userId,
    });
  }

  toPlainObject() {
    return {
      id: this.id,
      content: this.content,
      companyId: this.companyId,
      userId: this.userId,
    };
  }
}
