import * as mongoose from 'mongoose';

export const UI_NOTIFICATION_DOCUMENT = 'UI_NOTIFICATION_DOCUMENT';

export const UINotificationCollectionName = 'ui_notification';

export const UINotificationSchema = new mongoose.Schema({
  id: String,
  content: String,
});

export interface UINotificationDocument extends mongoose.Document {
  readonly id: string;
  readonly content: string;
}
