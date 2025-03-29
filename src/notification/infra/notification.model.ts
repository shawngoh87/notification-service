import * as mongoose from 'mongoose';

export const NOTIFICATION_MODEL = 'NOTIFICATION_MODEL';

export const NotificationType = {
  EMAIL: 'email',
  UI: 'ui',
} as const;

export const NotificationSchema = new mongoose.Schema({
  id: String,
  type: {
    type: String,
    enum: Object.values(NotificationType),
  },
  data: Object,
});
