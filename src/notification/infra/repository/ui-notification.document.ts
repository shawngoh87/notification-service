import * as mongoose from 'mongoose';

export const UI_NOTIFICATION_DOCUMENT = 'UI_NOTIFICATION_DOCUMENT';

export const UINotificationCollectionName = 'ui_notification';

export const UINotificationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  content: String,
  companyId: String,
  userId: String,
});

export interface UINotificationDocument extends mongoose.Document {
  readonly _id: mongoose.ObjectId;
  readonly content: string;
  readonly companyId: string;
  readonly userId: string;
}
