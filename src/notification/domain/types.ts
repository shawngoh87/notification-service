export const NotificationType = {
  LeaveBalanceReminder: 'leave-balance-reminder',
  MonthlyPayslip: 'monthly-payslip',
  HappyBirthday: 'happy-birthday',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationChannelType = {
  Email: 'email',
  UI: 'ui',
} as const;

export type NotificationChannelType =
  (typeof NotificationChannelType)[keyof typeof NotificationChannelType];

export type ChannelSubscription = {
  [key in NotificationChannelType]: boolean;
};
