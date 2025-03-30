import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Notification Service')
      .setDescription('Notification Service API description')
      .setVersion('0.0.1')
      .addTag('notification')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);

    const outputPath = path.resolve(process.cwd(), 'swagger.json');
    writeFileSync(outputPath, JSON.stringify(documentFactory(), null, 2), {
      encoding: 'utf8',
    });

    SwaggerModule.setup('docs', app, documentFactory);
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
