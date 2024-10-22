import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../entities/User.entity';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
