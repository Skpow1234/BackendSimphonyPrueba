import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database.module';
import { AuthModule } from './modules/auth.module';
import { UserModule } from './modules/user.module';
import { ServiceModule } from './modules/service.module';
import { UserSeeder } from './seeders/user.seeder';
import { ServiceSeeder } from './seeders/service.seeder';
import { DatabaseSeeder } from './seeders/database.seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './Entities/Service.entity';
import { User } from './Entities/User.entity';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UserModule,
    ServiceModule,
    TypeOrmModule.forFeature([Service, User]),
  ],
  controllers: [AppController],
  providers: [AppService, UserSeeder, ServiceSeeder, DatabaseSeeder],
})
export class AppModule {}
