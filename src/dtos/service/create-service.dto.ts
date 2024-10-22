import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    description: 'The name of the service',
    example: 'Enel',
  })
  @IsString({ message: 'The value must be a string' })
  @IsNotEmpty({ message: 'The name cannot be empty' })
  name: string;

  @ApiProperty({
    description: 'The description of the service',
    example: 'This service is for electricity payments',
  })
  @IsString({ message: 'The value must be a string' })
  description: string;

  @ApiProperty({
    description: 'The cost of the service in $',
    example: '10000.00',
  })
  @IsNumber({}, { message: 'The cost must be a number' })
  @IsNotEmpty({ message: 'The cost cannot be empty' })
  cost: number;

  @ApiProperty({
    description: 'The category of the service',
    example: 'Electricity',
  })
  @IsString({ message: 'The value must be a string' })
  @IsNotEmpty({ message: 'The category cannot be empty' })
  category: string;
}
