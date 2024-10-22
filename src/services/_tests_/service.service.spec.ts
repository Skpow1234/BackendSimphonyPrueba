/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceService } from '../../services/service.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Service } from '../../Entities/Service.entity';
import { User, UserRole } from '../../Entities/User.entity';
import { CreateServiceDto } from '../../dtos/service/create-service.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('ServiceService', () => {
  let serviceService: ServiceService;
  let serviceRepository: Repository<Service>;
  let userRepository: Repository<User>;

  const mockServiceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceService,
        {
          provide: getRepositoryToken(Service),
          useValue: mockServiceRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    serviceService = module.get<ServiceService>(ServiceService);
    serviceRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return an array of services', async () => {
      const expectedServices = [new Service(), new Service()];
      mockServiceRepository.find.mockResolvedValue(expectedServices);

      const services = await serviceService.findAll();
      expect(services).toEqual(expectedServices);
      expect(mockServiceRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should throw ConflictException if service already exists', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Service1',
        category: 'Category1',
        description: '',
        cost: 0,
      };
      mockServiceRepository.findOne.mockResolvedValue(new Service());

      await expect(
        serviceService.create(createServiceDto, 'user-id'),
      ).rejects.toThrow(ConflictException);

      expect(mockServiceRepository.findOne).toHaveBeenCalledWith({
        where: { name: createServiceDto.name, category: createServiceDto.category },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Service1',
        category: 'Category1',
        description: '',
        cost: 0,
      };
      mockServiceRepository.findOne.mockResolvedValue(null); 
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        serviceService.create(createServiceDto, 'user-id'),
      ).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'user-id' } });
    });

    it('should create and return a service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'Service1',
        category: 'Category1',
        description: '',
        cost: 0,
      };
      const user = new User();
      user.id = 'user-id';

      mockServiceRepository.findOne.mockResolvedValue(null); 
      mockUserRepository.findOne.mockResolvedValue(user); 
      mockServiceRepository.create.mockReturnValue(new Service());
      mockServiceRepository.save.mockResolvedValue(new Service());

      const service = await serviceService.create(createServiceDto, user.id);
      expect(service).toBeInstanceOf(Service);
      expect(mockServiceRepository.create).toHaveBeenCalledWith(createServiceDto);
      expect(mockServiceRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAllByUserIdAndRole', () => {
    it('should return services for a user', async () => {
      const userId = 'user-id';
      const role = UserRole.USER;
      const expectedServices = [new Service(), new Service()];

      mockUserRepository.findOne.mockResolvedValue(new User());
      mockServiceRepository.getMany.mockResolvedValue(expectedServices); 

      const services = await serviceService.findAllByUserIdAndRole(
        userId,
        1,
        10,
        role,
      );
      expect(services).toEqual(expectedServices);
      expect(mockServiceRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockServiceRepository.getMany).toHaveBeenCalled();
    });

    it('should return services for admin user', async () => {
      const userId = 'user-id';
      const role = UserRole.ADMIN;
      const expectedServices = [new Service(), new Service()];

      mockServiceRepository.getMany.mockResolvedValue(expectedServices); 

      const services = await serviceService.findAllByUserIdAndRole(
        userId,
        1,
        10,
        role,
      );
      expect(services).toEqual(expectedServices);
      expect(mockServiceRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(mockServiceRepository.getMany).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      const serviceId = 'service-id';

      await serviceService.delete(serviceId);
      expect(mockServiceRepository.delete).toHaveBeenCalledWith(serviceId);
    });
  });
});
