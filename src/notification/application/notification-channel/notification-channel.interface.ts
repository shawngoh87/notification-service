// TODO: Figure out how to map types to the channel
export interface NotificationChannel<TData = any> {
  send(params: {
    companyId: string;
    userId: string;
    data: TData;
  }): Promise<void>;
}
