import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { PrismaService } from './shared/prisma.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const prismaService = new PrismaService();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('HTTP_PORT');
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URL')],
        queue: configService.get<string>('RABBITMQ_QUEUE'),
        queueOptions: {
          durable: true,
        },
      },
    });
  await prismaService.enableShutdownHooks(app);
  app.startAllMicroservices();
  app.setGlobalPrefix('api');
  app.enableCors();
  await microservice.listen();
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();
