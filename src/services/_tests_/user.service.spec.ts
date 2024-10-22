/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../services/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from '../../Entities/User.entity';
import { Service } from '../../Entities/Service.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AssignServicesDto } from '../../dtos/service/assign-services.dto';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { RegisterUserDto } from '../../dtos/auth/register.dto';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let serviceRepository: Repository<Service>;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockServiceRepository = {
    findBy: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedpassword',
    services: [],
  };

  const mockService = {
    id: '1',
    name: 'Service 1',
    description: 'Service description',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServiceRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    serviceRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserRepository.find.mockResolvedValue([mockUser]);

      const users = await userService.findAll();

      expect(users).toEqual([mockUser]);
      expect(mockUserRepository.find).toHaveBeenCalledWith({
        relations: ['services'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const user = await userService.findOne('1');

      expect(user).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['services'],
      });
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(userService.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        name: '',
        role: UserRole.USER,
      };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const user = await userService.create(createUserDto);

      expect(user).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw a ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password',
        name: '',
        role: UserRole.USER,
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(userService.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'new@example.com',
        password: 'password',
        name: '',
      };
      mockUserRepository.findOne.mockResolvedValue(null);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const user = await userService.register(registerUserDto);

      expect(user).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerUserDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...registerUserDto,
        password: 'hashedpassword',
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw a ConflictException if email already exists', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'existing@example.com',
        password: 'password',
        name: '',
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(userService.register(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('should update a user and return the updated user', async () => {
      const updatedUser = { ...mockUser, email: 'updated@example.com' };
      mockUserRepository.update.mockResolvedValue(updatedUser);
      mockUserRepository.findOne.mockResolvedValue(updatedUser);

      const user = await userService.update('1', {
        email: 'updated@example.com',
      });

      expect(user).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', {
        email: 'updated@example.com',
      });
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      await userService.delete('1');

      expect(mockUserRepository.softDelete).toHaveBeenCalledWith('1');
    });
  });

  describe('assignServicesToUser', () => {
    it('should assign services to a user', async () => {
      const assignServicesDto: AssignServicesDto = { serviceIds: ['1'] };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockServiceRepository.findBy.mockResolvedValue([mockService]);

      const user = await userService.assignServicesToUser(
        '1',
        assignServicesDto,
      );

      expect(user.services).toContainEqual(mockService);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const assignServicesDto: AssignServicesDto = { serviceIds: ['1'] };
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.assignServicesToUser('non-existent-id', assignServicesDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if one or more services not found', async () => {
      const assignServicesDto: AssignServicesDto = { serviceIds: ['1', '2'] };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockServiceRepository.findBy.mockResolvedValue([]);

      await expect(
        userService.assignServicesToUser('1', assignServicesDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
