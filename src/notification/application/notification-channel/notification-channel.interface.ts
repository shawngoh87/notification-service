// TODO: Figure out how to map types to the channel
export interface NotificationChannel<TData = any> {
  send(data: TData): Promise<void>;
}
