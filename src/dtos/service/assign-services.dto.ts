import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class AssignServicesDto {
  @ApiProperty({
    description: 'IDs of the services to be assigned to the user.',
    example: [
      'c3a5f6d7-1b5e-4b56-9c0b-0cfb287b',
      'cbbd7af8-2b6d-4418-ae6e-0cfc1b287',
    ],
  })
  @IsArray()
  @IsNotEmpty({ message: 'The list of IDs cannot be empty.' })
  @IsUUID('4', { each: true, message: 'Each service ID must be a valid UUID.' })
  serviceIds: string[];
}
