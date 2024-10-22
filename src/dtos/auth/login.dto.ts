import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The user\'s email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'The email must be a valid email address.' })
  email: string;

  @ApiProperty({
    description: 'The user\'s password',
    example: 'my_secret_password',
  })
  @IsNotEmpty({ message: 'The password cannot be empty.' })
  @MinLength(6, { message: 'The password must be at least 6 characters long.' })
  password: string;
}
