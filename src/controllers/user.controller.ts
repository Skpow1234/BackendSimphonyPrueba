import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../entities/User.entity';
import { Roles } from '../decorators/roles.decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AssignServicesDto } from '../dtos/service/assign-services.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List users.',
    description:
      'This endpoint allows listing all users (Admin users only).',
  })
  @ApiResponse({
    status: 200,
    description: 'Users successfully retrieved.',
  })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':idUser')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Find user by ID.',
    description:
      'This endpoint retrieves user information by their ID.',
  })
  @ApiResponse({ status: 200, description: 'User successfully retrieved.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('idUser') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Create users.',
    description:
      'This endpoint allows creating users (Admin users only).',
  })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post(':idUser/services')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Assign multiple services to a user.',
    description:
      'This endpoint allows assigning multiple services to a user using their IDs (Admin users only).',
  })
  @ApiResponse({
    status: 201,
    description: 'Services successfully assigned to the user.',
  })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({
    status: 404,
    description: 'User or services not found.',
  })
  async assignServicesToUser(
    @Param('idUser') id: string,
    @Body() assignServicesDto: AssignServicesDto,
  ) {
    return this.userService.assignServicesToUser(id, assignServicesDto);
  }

  @Delete(':idUser')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete users.',
    description:
      'This endpoint allows deleting a user and their services (Admin users only).',
  })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async delete(@Param('idUser') id: string) {
    return this.userService.delete(id);
  }
}
