import { Controller, Post, Body, Get, Param, Delete, UseGuards, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookingService } from '../services/booking.service';
import { JwtAuthGuard } from '../../authentication/guards/jwtauth.guard';
import { CustomerGuard } from '../../authentication/guards/customer.guard';
import { PainterGuard } from '../../authentication/guards/painter.guard';
import { LoggedInUser } from '../../authentication/decorators/get-current-user';
import { User } from '../../authentication/entities/users.entity';
import { CreateBookingDto, BookingConflictResponseDto } from '../dto/booking.dto';
import { BookingResponseDto } from '../dto/booking.response.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingController {
  private readonly logger = new Logger(BookingController.name);
  
  constructor(private readonly bookingService: BookingService) {}

  @Post('request')
  @ApiOperation({ summary: 'Create a new booking request without authentication' })
  @ApiResponse({
    status: 201,
    description: 'Booking request created and confirmed successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'No available painters or time slot just booked',
    type: BookingConflictResponseDto
  })
  async createPublicBookingRequest(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(null, createBookingDto);
  }
  
  @Post('request/authenticated')
  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new booking request as an authenticated user' })
  @ApiResponse({
    status: 201,
    description: 'Booking request created and confirmed successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'No available painters or time slot just booked',
    type: BookingConflictResponseDto
  })
  async createBookingRequest(
    @LoggedInUser() user: Partial<User>,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    this.logger.log(`Customer ${user.id} creating a booking request`);
    return this.bookingService.createBooking(user.id, createBookingDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings for the current customer' })
  @ApiResponse({
    status: 200,
    description: 'List of customer\'s bookings',
    type: [BookingResponseDto],
  })
  async getCustomerBookings(@LoggedInUser() user: Partial<User>) {
    return this.bookingService.getCustomerBookings(user.id);
  }

  @Get('painter')
  @UseGuards(JwtAuthGuard, PainterGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings assigned to the current painter' })
  @ApiResponse({
    status: 200,
    description: 'List of painter\'s bookings',
    type: [BookingResponseDto],
  })
  async getPainterBookings(@LoggedInUser() user: Partial<User>) {
    return this.bookingService.getPainterBookings(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking details by ID without authentication' })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Delete(':id/cancel')
  @UseGuards(JwtAuthGuard, CustomerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({
    status: 200,
    description: 'Booking cancelled successfully',
    type: BookingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(
    @LoggedInUser() user: Partial<User>,
    @Param('id') id: string,
  ) {
    this.logger.log(`Customer ${user.id} cancelling booking ${id}`);
    return this.bookingService.cancelBooking(id, user.id, false);
  }
}
