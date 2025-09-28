import { Injectable, Logger, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../repositories/booking.repository';
import { AvailabilityRepository } from '../repositories/availability.repository';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Availability } from '../entities/availability.entity';
import { CreateBookingDto, BookingSuggestionDto, BookingConflictResponseDto } from '../dto/booking.dto';
import { BookingResponseDto } from '../dto/booking.response.dto';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async createBooking(customerId: string | null, dto: CreateBookingDto): Promise<BookingResponseDto> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);
    this.validateTimeRange(startTime, endTime);

    if (dto.clientRequestId) {
      const existingBooking = await this.bookingRepository.findByClientRequestId(dto.clientRequestId);
      if (existingBooking) {
        this.logger.log(`Found existing booking for clientRequestId ${dto.clientRequestId}`);
        return this.mapBookingToResponseDto(existingBooking);
      }
    }

    const availabilities = await this.availabilityRepository.findAvailableForTimeSlot(startTime, endTime);
    
    if (availabilities.length === 0) {
      const suggestions = await this.findAlternativeSlots(startTime, endTime);
      const conflictResponse: BookingConflictResponseDto = {
        error: 'No painters are available for the requested time slot.',
        code: 'NO_AVAILABILITY',
        suggestions
      };
      throw new ConflictException(conflictResponse);
    }

    const selectedPainter = await this.selectOptimalPainter(availabilities, startTime, endTime);
    
    const hasOverlap = await this.bookingRepository.hasOverlappingBookings(
      selectedPainter.userId,
      startTime,
      endTime
    );
    
    if (hasOverlap) {
      this.logger.warn(`Painter ${selectedPainter.userId} already has overlapping bookings for time slot ${startTime} - ${endTime}`);
      const suggestions = await this.findAlternativeSlots(startTime, endTime);
      const conflictResponse: BookingConflictResponseDto = {
        error: 'This painter already has a booking during the requested time slot.',
        code: 'PAINTER_ALREADY_BOOKED',
        suggestions
      };
      throw new ConflictException(conflictResponse);
    }
    
    try {
      const booking = await this.bookingRepository.createBookingWithTransaction(
        selectedPainter.userId,
        customerId,
        startTime,
        endTime,
        dto.clientRequestId,
      );
      
      this.logger.log(`Created booking ${booking.id} for customer ${customerId || 'anonymous'} with painter ${selectedPainter.userId}`);
      return this.mapBookingToResponseDto(booking);
    } catch (error) {
      this.logger.error(`Failed to create booking: ${error.message}`, error.stack);
      
      if (error.message.includes('no_overlapping_bookings')) {
        const suggestions = await this.findAlternativeSlots(startTime, endTime);
        const conflictResponse: BookingConflictResponseDto = {
          error: 'This time slot has just been booked. Please select another time.',
          code: 'OVERLAPPING_BOOKING',
          suggestions
        };
        throw new ConflictException(conflictResponse);
      }
      
      throw error;
    }
  }

  async getBookingById(id: string): Promise<BookingResponseDto> {
    const booking = await this.bookingRepository.findById(id);
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    return this.mapBookingToResponseDto(booking);
  }

  async getCustomerBookings(customerId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingRepository.findByCustomerId(customerId);
    return bookings.map(booking => this.mapBookingToResponseDto(booking));
  }

  async getPainterBookings(painterId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingRepository.findByPainterId(painterId);
    return bookings.map(booking => this.mapBookingToResponseDto(booking));
  }

  async cancelBooking(id: string, userId: string, isPainter: boolean): Promise<BookingResponseDto> {
    const booking = await this.bookingRepository.findById(id);
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    if (isPainter && booking.painterId !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    } else if (!isPainter && booking.customerId !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }
    
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }
    
    const cancelledBooking = await this.bookingRepository.cancelBooking(id);
    this.logger.log(`Cancelled booking ${id}`);
    
    return this.mapBookingToResponseDto(cancelledBooking);
  }

  private async findAlternativeSlots(startTime: Date, endTime: Date): Promise<BookingSuggestionDto[]> {
    return this.bookingRepository.findClosestAvailableSlots(startTime, endTime);
  }

  private async selectOptimalPainter(
    availabilities: Availability[],
    requestedStart: Date,
    requestedEnd: Date,
  ): Promise<Availability> {
    if (availabilities.length === 1) {
      return availabilities[0];
    }
    
    const scores = await Promise.all(
      availabilities.map(async availability => {
        const bookings = await this.bookingRepository.findByPainterId(availability.userId);
        
        const leftoverTime = (
          (availability.endTime.getTime() - requestedEnd.getTime()) +
          (requestedStart.getTime() - availability.startTime.getTime())
        ) / (60 * 1000); 
        
        
        const rating = availability.user?.rating || 0;
        
        
        const RATING_WEIGHT = 3;
        const LOAD_WEIGHT = 2;
        const FIT_WEIGHT = 1;
        
    
        const score = 
          (rating * RATING_WEIGHT) - 
          (bookings.length * LOAD_WEIGHT) -
          (leftoverTime * FIT_WEIGHT / 100); 
          
        return {
          availability,
          score,
        };
      })
    );
    
    scores.sort((a, b) => b.score - a.score);
    return scores[0].availability;
  }

  private validateTimeRange(startTime: Date, endTime: Date): void {
    const now = new Date();
    
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }
    
    
    if (startTime < now) {
      throw new BadRequestException('Start time must be in the future');
    }
    
    
    const minimumDurationMs = 15 * 60 * 1000;
    if (endTime.getTime() - startTime.getTime() < minimumDurationMs) {
      throw new BadRequestException('Booking must be at least 15 minutes long');
    }
    
    
    const maximumDurationMs = 8 * 60 * 60 * 1000; 
    if (endTime.getTime() - startTime.getTime() > maximumDurationMs) {
      throw new BadRequestException('Booking cannot be longer than 8 hours');
    }
  }

  private mapBookingToResponseDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      painterId: booking.painterId,
      customerId: booking.customerId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      painter: booking.painter ? {
        id: booking.painter.id,
        name: booking.painter.name,
        email: booking.painter.email,
        phone: booking.painter.phone || '',
        rating: booking.painter.rating || 0,
      } : undefined,
    };
  }
}
