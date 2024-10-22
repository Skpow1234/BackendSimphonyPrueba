import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt({ message: 'The value must be an integer.' })
  @Min(1, { message: 'The value must be at least 1.' })
  page?: number = 1; 

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsInt({ message: 'The value must be an integer.' })
  @Min(1, { message: 'The value must be at least 1.' })
  limit?: number = 10; 
}
