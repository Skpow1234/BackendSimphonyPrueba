import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ServiceService } from '../services/service.service';
import { CreateServiceDto } from '../dtos/service/create-service.dto';
import { UserRole } from '../Entities/User.entity';
import { PaginationDto } from '../dtos/general/pagination.dto';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorators';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List services.',
    description:
      'This endpoint allows listing services based on the user role.',
  })
  @ApiResponse({ status: 200, description: 'Services listed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async findAll(@Query() paginationDto: PaginationDto, @Req() req: Request) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    return this.serviceService.findAllByUserIdAndRole(
      userId,
      page,
      limit,
      userRole as UserRole,
    );
  }

  @Get(':idUser/services')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List services by user ID.',
    description:
      'This endpoint allows listing services by user ID, only for admin users.',
  })
  @ApiResponse({ status: 200, description: 'Services listed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async findAllByIdUser(
    @Param('idUser') id: string,
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
  ) {
    const userRole = req.user?.role;

    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    return this.serviceService.findAllByUserIdAndRole(
      id,
      page,
      limit,
      userRole as UserRole,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new service.',
    description:
      'This endpoint allows creating a service and assigning it to the user who created it.',
  })
  @ApiResponse({ status: 201, description: 'Service successfully created.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.userId;
    return this.serviceService.create(createServiceDto, userId);
  }

  @Delete(':idService')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a service.',
    description: 'This endpoint allows deleting a service.',
  })
  @ApiResponse({ status: 200, description: 'Service successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Invalid token.' })
  @ApiResponse({ status: 403, description: 'Access denied.' })
  async delete(@Param('idService') id: string) {
    return this.serviceService.delete(id);
  }
}
