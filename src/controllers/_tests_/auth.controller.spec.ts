/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { LoginDto } from '../../dtos/auth/login.dto';
import { RegisterUserDto } from '../../dtos/auth/register.dto';
import { LoginResponseDto } from '../../dtos/auth/loginResponse.dto';
import { UserRole } from '../../Entities/User.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  const mockLoginDto: LoginDto = {
    email: 'john@example.com',
    password: '123456',
  };

  const mockRegisterUserDto: RegisterUserDto = {
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  };

  const mockLoginResponse: LoginResponseDto = {
    accessToken: 'token123',
    role: UserRole.USER,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      expect(await authController.login(mockLoginDto)).toBe(mockLoginResponse);
    });

    it('should throw a NotFoundException for invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(
        new NotFoundException('Invalid credentials'),
      );

      await expect(authController.login(mockLoginDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      mockAuthService.register.mockResolvedValue(undefined);

      await expect(authController.create(mockRegisterUserDto)).resolves.toBeUndefined();
    });

    it('should throw a ConflictException if the user already exists', async () => {
      mockAuthService.register.mockRejectedValue(
        new ConflictException('User already exists'),
      );

      await expect(authController.create(mockRegisterUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
