import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { LoginResponseDto } from '../dtos/auth/loginResponse.dto';
import { RegisterUserDto } from '../dtos/auth/register.dto';
import { User } from '../entities/User.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user; 
    }
    return null;
  }

  async login({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const foundUser = await this.userService.findByEmail(email);

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      email: foundUser.email,
      sub: foundUser.id,
      role: foundUser.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      role: foundUser.role,
    };
  }

  async register(userData: RegisterUserDto): Promise<User> {
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    return await this.userService.register(userData);
  }
}
