import * as mongoose from 'mongoose';

export const UI_NOTIFICATION_DOCUMENT = 'UI_NOTIFICATION_DOCUMENT';

export const UINotificationCollectionName = 'ui_notification';

export const UINotificationSchema = new mongoose.Schema({
  companyId: String,
  userId: String,
  content: String,
});

export interface UINotificationDocument
  extends mongoose.Document<mongoose.Types.ObjectId> {
  readonly _id: mongoose.Types.ObjectId;
  readonly companyId: string;
  readonly userId: string;
  readonly content: string;
}
