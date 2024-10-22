import { Test, TestingModule } from '@nestjs/testing';
import { ServiceController } from '../service.controller';
import { ServiceService } from '../../services/service.service';
import { CreateServiceDto } from '../../dtos/service/create-service.dto';
import { PaginationDto } from '../../dtos/general/pagination.dto';
import { UserRole } from '../../Entities/User.entity';
import { Request } from 'express';

describe('ServiceController', () => {
  let serviceController: ServiceController;
  let serviceService: ServiceService;

  const mockServiceService = {
    findAllByUserIdAndRole: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserId = '1';
  const mockUserRole = UserRole.USER;

  const createMockRequest = (userId: string, role: UserRole): Request => {
    return {
      user: { userId, role },
      get: jest.fn(),
      header: jest.fn(),
      accepts: jest.fn(),
      acceptsCharsets: jest.fn(),
      acceptsEncodings: jest.fn(),
      acceptsLanguages: jest.fn(),
      body: {},
      params: {},
      query: {},
    } as unknown as Request;
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceController],
      providers: [
        {
          provide: ServiceService,
          useValue: mockServiceService,
        },
      ],
    }).compile();

    serviceController = module.get<ServiceController>(ServiceController);
    serviceService = module.get<ServiceService>(ServiceService);
  });

  describe('findAll', () => {
    it('should return a list of services', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const expectedResult = [{ id: '1', name: 'Service 1' }];

      mockServiceService.findAllByUserIdAndRole.mockResolvedValue(
        expectedResult,
      );

      const req = createMockRequest(mockUserId, mockUserRole);

      expect(await serviceController.findAll(paginationDto, req)).toBe(
        expectedResult,
      );
      expect(mockServiceService.findAllByUserIdAndRole).toHaveBeenCalledWith(
        mockUserId,
        1,
        10,
        mockUserRole,
      );
      expect(mockServiceService.findAllByUserIdAndRole).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllByIdUser', () => {
    it('should return a list of services for a specific user', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const mockUserId = '2';
      const mockUserRole = UserRole.ADMIN;
      const expectedResult = [{ id: '2', name: 'Service 2' }];

      mockServiceService.findAllByUserIdAndRole.mockResolvedValue(
        expectedResult,
      );

      const req = createMockRequest('', mockUserRole);

      expect(
        await serviceController.findAllByIdUser(mockUserId, paginationDto, req),
      ).toBe(expectedResult);
      expect(mockServiceService.findAllByUserIdAndRole).toHaveBeenCalledWith(
        mockUserId,
        1,
        10,
        mockUserRole,
      );
      expect(mockServiceService.findAllByUserIdAndRole).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const createServiceDto: CreateServiceDto = {
        name: 'New Service',
        description: 'Service Description',
        cost: 0,
        category: '',
      };
      const expectedResult = { id: '3', ...createServiceDto };

      mockServiceService.create.mockResolvedValue(expectedResult);

      const req = createMockRequest(mockUserId, mockUserRole);

      expect(await serviceController.create(createServiceDto, req)).toBe(
        expectedResult,
      );
      expect(mockServiceService.create).toHaveBeenCalledWith(
        createServiceDto,
        mockUserId,
      );
      expect(mockServiceService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a service', async () => {
      const mockServiceId = '1';
      mockServiceService.delete.mockResolvedValue(undefined);

      await expect(
        serviceController.delete(mockServiceId),
      ).resolves.toBeUndefined();
      expect(mockServiceService.delete).toHaveBeenCalledWith(mockServiceId);
      expect(mockServiceService.delete).toHaveBeenCalledTimes(1);
    });
  });
});
