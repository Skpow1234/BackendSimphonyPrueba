import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'The user\'s name',
    example: 'Development Test',
  })
  @IsNotEmpty({ message: 'The name cannot be empty.' })
  @IsString()
  name: string;

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
  @MinLength(8, { message: 'The password must be at least 8 characters long.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}
