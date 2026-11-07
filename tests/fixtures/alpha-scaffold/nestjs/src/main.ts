import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

/** Origins allowed to call this API, from the comma-separated CORS_ORIGINS. */
function corsOrigins(): string[] {
  return (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: { origin: corsOrigins() } });
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
