import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../Entities/User.entity'; 

export class LoginResponseDto {
  @ApiProperty({
    description: 'Access token generated for the user',
    example: 'gu23vebu9213bvuH3JH3I2HOhjouh32hoj...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User role',
    example: 'admin',
  })
  role: UserRole; 
}
