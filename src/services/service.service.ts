import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../Entities/Service.entity';
import { CreateServiceDto } from '../dtos/service/create-service.dto';
import { User, UserRole } from '../entities/User.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.find();
  }

  async create(
    createServiceDto: CreateServiceDto,
    userId: string,
  ): Promise<Service> {
    const existingService = await this.serviceRepository.findOne({
      where: {
        name: createServiceDto.name,
        category: createServiceDto.category,
      },
    });

    if (existingService) {
      throw new ConflictException(
        'A service with the same name and category already exists.',
      );
    }

    const service = this.serviceRepository.create(createServiceDto);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    service.users = [user];

    return this.serviceRepository.save(service);
  }

  async findAllByUserIdAndRole(
    userId: string,
    page: number = 1,
    limit: number = 10,
    role: UserRole,
  ): Promise<Service[]> {
    const queryBuilder = this.serviceRepository.createQueryBuilder('service');

    if (role !== UserRole.ADMIN) {
      queryBuilder
        .innerJoin('service.users', 'user')
        .where('user.id = :userId', { userId });
    }

    return await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async delete(id: string): Promise<void> {
    const result = await this.serviceRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with id ${id} not found.`);
    }
  }
}
