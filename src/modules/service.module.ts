import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../Entities/Service.entity';
import { ServiceService } from '../services/service.service';
import { ServiceController } from '../controllers/service.controller';
import { User } from '../entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service, User])],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}
