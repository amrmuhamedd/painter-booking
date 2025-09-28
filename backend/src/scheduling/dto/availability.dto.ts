import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty({
    description: 'Start time of availability slot (ISO format)',
    example: '2025-10-01T09:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End time of availability slot (ISO format)',
    example: '2025-10-01T17:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;
}

export class AvailabilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  painterId: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class FilterAvailabilityDto {
  @ApiProperty({
    description: 'Start date for filtering availabilities',
    example: '2025-10-01T00:00:00Z',
    required: false,
  })
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering availabilities',
    example: '2025-10-31T23:59:59Z',
    required: false,
  })
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Filter by specific painter ID',
    required: false,
  })
  @IsUUID()
  painterId?: string;
}
