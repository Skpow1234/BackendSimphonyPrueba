import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceService } from '../services/service.service';

@Injectable()
export class ServiceSeeder {
  constructor(
    private readonly serviceService: ServiceService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const users = await this.userRepository.find();

    if (users.length === 0) {
      console.log('No users available to assign services to.');
      return;
    }

    const services = [
      {
        name: 'Technology Service',
        description: 'Description of technology service',
        cost: 100,
        category: 'Technology',
        userId: users[0]?.id || null,
      },
      {
        name: 'Health Service',
        description: 'Description of health service',
        cost: 200,
        category: 'Health',
        userId: users[1]?.id || users[0]?.id || null,
      },
      {
        name: 'Home Service',
        description: 'Description of home service',
        cost: 300,
        category: 'Home',
        userId: users[2]?.id || users[1]?.id || users[0]?.id || null,
      },
      {
        name: 'Education Service',
        description: 'Description of education service',
        cost: 400,
        category: 'Education',
        userId: users[0]?.id || null,
      },
      {
        name: 'Consulting Service',
        description: 'Description of consulting service',
        cost: 500,
        category: 'Consulting',
        userId: users[1]?.id || users[0]?.id || null,
      },
    ];

    try {
      await Promise.all(
        services.map(async (service) => {
          if (service.userId) {
            await this.serviceService.create(service, service.userId);
          } else {
            console.log(`No user available for service: ${service.name}`);
          }
        }),
      );
      console.log('Services seeded successfully.');
    } catch (error) {
      console.error('Error seeding services:', error.message);
    }
  }
}
