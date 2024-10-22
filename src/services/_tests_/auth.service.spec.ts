/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../services/auth.service';
import { UserService } from './../user.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../../dtos/auth/login.dto';
import { RegisterUserDto } from '../../dtos/auth/register.dto';
import { User, UserRole } from '../../entities/User.entity';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    register: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw NotFoundException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '12345',
      };
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '12345',
      };
      const foundUser = new User();
      foundUser.password = await bcrypt.hash('correct-password', 10);

      mockUserService.findByEmail.mockResolvedValue(foundUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); 

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return an access token and role if login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '12345',
      };
      const foundUser = new User();
      foundUser.password = await bcrypt.hash('12345', 10);
      foundUser.role = UserRole.USER;

      mockUserService.findByEmail.mockResolvedValue(foundUser);
      mockJwtService.sign.mockReturnValue('fake-jwt-token');

      const response = await authService.login(loginDto);
      expect(response).toEqual({
        accessToken: 'fake-jwt-token',
        role: foundUser.role,
      });
    });
  });

  describe('validateUser', () => {
    it('should return user if email and password are valid', async () => {
      const email = 'test@example.com';
      const password = '12345';
      const foundUser = new User();
      foundUser.password = await bcrypt.hash(password, 10);

      mockUserService.findByEmail.mockResolvedValue(foundUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); 

      const result = await authService.validateUser(email, password);
      expect(result).toEqual(foundUser);
    });

    it('should return null if user is not found', async () => {
      const email = 'test@example.com';
      const password = '12345';

      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';
      const foundUser = new User();
      foundUser.password = await bcrypt.hash('correct-password', 10);

      mockUserService.findByEmail.mockResolvedValue(foundUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Mock de bcrypt.compare

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: '12345',
        name: 'Test User',
      };
      const createdUser = new User();

      mockUserService.register.mockResolvedValue(createdUser);

      const result = await authService.register(registerUserDto);
      expect(result).toEqual(createdUser);
      expect(mockUserService.register).toHaveBeenCalledWith(registerUserDto); 
    });
  });
});
