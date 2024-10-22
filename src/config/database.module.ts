import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Service } from '../Entities/Service.entity';
import { User } from '../Entities/User.entity';
import { UserModule } from '../modules/user.module';
import { AuthModule } from '../modules/auth.module';
import { ServiceModule } from '../modules/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Service],
        autoLoadEntities: true,
        synchronize: true, // Dado que es un ejemplo, lo pondremos así, pero para un ambiente de producción, usualmente se harian migraciones
        //synchronize: process.env.NODE_ENV !== 'production',
      }),
    }),
    UserModule,
    AuthModule,
    ServiceModule,
  ],
})
export class DatabaseModule {}
