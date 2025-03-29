export const NotificationType = {
  LeaveBalanceReminder: 'leave-balance-reminder',
  MonthlyPayslip: 'monthly-payslip',
  HappyBirthday: 'happy-birthday',
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export const NotificationChannel = {
  Email: 'email',
  UI: 'ui',
} as const;

export type NotificationChannel =
  (typeof NotificationChannel)[keyof typeof NotificationChannel];
