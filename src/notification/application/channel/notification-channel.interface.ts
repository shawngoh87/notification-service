// TODO: Figure out how to map types to the channel
export interface NotificationChannel<TData = any, TReturn = void> {
  send(data: TData): Promise<TReturn>;
}
