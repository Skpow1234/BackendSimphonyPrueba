import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../../services/user.service';
import { CreateUserDto } from '../../dtos/user/create-user.dto';
import { AssignServicesDto } from '../../dtos/service/assign-services.dto';
import { UserRole } from '../../Entities/User.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    assignServicesToUser: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
      mockUserService.findAll.mockResolvedValue(result);

      expect(await userController.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = { id: '1', name: 'John Doe', email: 'john@example.com' };
      mockUserService.findOne.mockResolvedValue(result);

      expect(await userController.findOne('1')).toBe(result);
    });

    it('should throw a NotFoundException if user not found', async () => {
      mockUserService.findOne.mockRejectedValue(
        new NotFoundException('Usuario no encontrado'),
      );

      await expect(userController.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        role: UserRole.USER,
      };
      const result = { id: '1', ...createUserDto };
      mockUserService.create.mockResolvedValue(result);

      expect(await userController.create(createUserDto)).toBe(result);
    });
  });

  describe('assignServicesToUser', () => {
    it('should assign services to a user', async () => {
      const assignServicesDto: AssignServicesDto = {
        serviceIds: ['1', '2', '3'],
      };
      mockUserService.assignServicesToUser.mockResolvedValue(undefined);

      await userController.assignServicesToUser('1', assignServicesDto);
      expect(mockUserService.assignServicesToUser).toHaveBeenCalledWith(
        '1',
        assignServicesDto,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      mockUserService.delete.mockResolvedValue(undefined);

      await userController.delete('1');
      expect(mockUserService.delete).toHaveBeenCalledWith('1');
    });
  });
});
