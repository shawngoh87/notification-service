import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@nestjs/config';
import { existsSync } from 'fs';

@Module({
  imports: [
    NotificationModule,
    ConfigModule.forRoot({
      envFilePath: existsSync(`${process.cwd()}/.env.${process.env.NODE_ENV}`)
        ? `${process.cwd()}/.env.${process.env.NODE_ENV}`
        : `${process.cwd()}/.env`,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
