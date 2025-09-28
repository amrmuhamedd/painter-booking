import { ApiProperty } from "@nestjs/swagger";
import { BookingStatus } from "../entities/booking.entity";

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  painterId: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
  
  @ApiProperty()
  painter?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    rating?: number;
  };
}