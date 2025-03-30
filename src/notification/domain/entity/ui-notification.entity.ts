import { v4 as uuidv4 } from 'uuid';

export class UINotification {
  private id: string;
  private content: string;

  constructor(props: { id: string; content: string }) {
    this.id = props.id;
    this.content = props.content;
  }

  static create(props: { content: string }): UINotification {
    return new UINotification({
      id: uuidv4(),
      content: props.content,
    });
  }

  toPlainObject() {
    return {
      id: this.id,
      content: this.content,
    };
  }
}
