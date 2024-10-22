import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DatabaseSeeder } from './src/seeders/database.seeder';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const databaseSeeder = appContext.get(DatabaseSeeder);
  await databaseSeeder.seed();
  await appContext.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
