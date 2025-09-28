import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBookingDto {
  @ApiProperty({
    description: 'Start time of booking (ISO format)',
    example: '2025-10-01T10:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    description: 'End time of booking (ISO format)',
    example: '2025-10-01T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({
    description: 'Optional client request ID for idempotency',
    required: false,
  })
  @IsOptional()
  clientRequestId?: string;
}



export class BookingSuggestionDto {
  @ApiProperty({
    description: 'ID of the painter available for this slot',
  })
  painterId: string;

  @ApiProperty({
    description: 'Name of the painter available for this slot',
  })
  painterName: string;

  @ApiProperty({
    description: 'Start time of the available slot',
    example: '2025-10-01T10:00:00Z',
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the available slot',
    example: '2025-10-01T12:00:00Z',
  })
  endTime: string;
  
  @ApiProperty({
    description: 'Time difference in minutes between requested slot and this suggestion (positive = later, negative = earlier)',
    example: 30,
  })
  gapMinutes: number;
}

export class BookingConflictResponseDto {
  @ApiProperty({
    description: 'Error message explaining why the booking could not be made',
  })
  error: string;

  @ApiProperty({
    description: 'Error code for programmatic handling',
    enum: ['NO_AVAILABILITY', 'PAINTER_ALREADY_BOOKED', 'OVERLAPPING_BOOKING'],
    required: false,
  })
  code?: string;

  @ApiProperty({
    description: 'Alternative booking slot suggestions',
    type: [BookingSuggestionDto],
  })
  suggestions: BookingSuggestionDto[];
}
