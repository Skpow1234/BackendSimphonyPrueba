import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import * as bcrypt from 'bcrypt';
import { AssignServicesDto } from '../dtos/service/assign-services.dto';
import { Service } from '../Entities/Service.entity';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { RegisterUserDto } from '../dtos/auth/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['services'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['services'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return user; 
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async register(userData: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new ConflictException('Email is already in use.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    await this.userRepository.softDelete(id);
  }

  async assignServicesToUser(
    userId: string,
    assignServicesDto: AssignServicesDto,
  ): Promise<User> {
    const { serviceIds } = assignServicesDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['services'],
    });
    if (!user) {
      throw new NotFoundException(`User not found.`);
    }

    const services = await this.serviceRepository.findBy({
      id: In(serviceIds),
    });
    if (services.length !== serviceIds.length) {
      throw new NotFoundException('One or more services not found.');
    }


    user.services = [...new Set([...user.services, ...services])];
    return this.userRepository.save(user);
  }
}
