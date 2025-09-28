import { IsEmail, IsNotEmpty, MinLength, Matches, IsEnum, IsOptional, IsPhoneNumber, IsString, IsNumber, Min, Max, ValidateIf } from 'class-validator';
import { UserRole } from '../entities/users.entity';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User full name',
    minLength: 3,
    example: 'John Doe',
  })
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description:
      'User password (must contain at least one letter, one number, and one special character)',
    minLength: 8,
    example: 'P@ssword123',
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/[A-Za-z]/, {
    message: 'Password must contain at least one letter.',
  })
  @Matches(/\d/, { message: 'Password must contain at least one number.' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, {
    message: 'Password must contain at least one special character.',
  })
  password: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role (painter or customer)',
    enum: UserRole,
    default: UserRole.CUSTOMER,
    required: false,
    example: 'painter',
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    description: 'Phone number (required for painters)',
    example: '+1234567890',
    required: false,
  })
  @ValidateIf(o => o.role === UserRole.PAINTER)
  @IsNotEmpty({ message: 'Phone number is required for painters' })
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiProperty({
    description: 'Painter specialization',
    example: 'interior',
    enum: ['interior', 'exterior', 'decorative', 'commercial', 'residential'],
    required: false,
  })
  @ValidateIf(o => o.role === UserRole.PAINTER)
  @IsNotEmpty({ message: 'Specialization is required for painters' })
  @IsString()
  specialization?: string;

  @ApiProperty({
    description: 'Years of experience',
    example: 5,
    minimum: 0,
    maximum: 50,
    required: false,
  })
  @ValidateIf(o => o.role === UserRole.PAINTER)
  @IsNotEmpty({ message: 'Experience is required for painters' })
  @IsNumber({}, { message: 'Experience must be a number' })
  @Min(0)
  @Max(50)
  experience?: number;

  @ApiProperty({
    description: 'Hourly rate in USD',
    example: 25,
    minimum: 10,
    maximum: 500,
    required: false,
  })
  @ValidateIf(o => o.role === UserRole.PAINTER)
  @IsNotEmpty({ message: 'Hourly rate is required for painters' })
  @IsNumber({}, { message: 'Hourly rate must be a number' })
  @Min(10)
  @Max(500)
  hourlyRate?: number;
}
