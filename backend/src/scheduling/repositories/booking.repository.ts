import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { BookingSuggestionDto } from '../dto/booking.dto';

@Injectable()
export class BookingRepository {
  private readonly logger = new Logger(BookingRepository.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { id },
      relations: ['painter', 'customer'],
    });
  }

  async findByClientRequestId(clientRequestId: string): Promise<Booking> {
    return this.bookingRepository.findOne({
      where: { clientRequestId },
      relations: ['painter', 'customer'],
    });
  }

  async findByPainterId(painterId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { painterId, status: BookingStatus.CONFIRMED },
      relations: ['customer'],
      order: { startTime: 'ASC' },
    });
  }
  
  async hasOverlappingBookings(painterId: string, startTime: Date, endTime: Date): Promise<boolean> {
    this.logger.debug(`Checking for overlapping bookings for painter ${painterId} from ${startTime} to ${endTime}`);
    
    const overlappingBookings = await this.bookingRepository
      .createQueryBuilder('booking')
      .where('booking.painterId = :painterId', { painterId })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .andWhere(
        '(booking.startTime < :endTime AND booking.endTime > :startTime)',
        { startTime, endTime }
      )
      .getCount();
      
    return overlappingBookings > 0;
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { customerId },
      relations: ['painter'],
      order: { startTime: 'ASC' },
    });
  }

  async createBookingWithTransaction(
    painterId: string,
    customerId: string | null,
    startTime: Date,
    endTime: Date,
    clientRequestId?: string,
  ): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (clientRequestId) {
        const existingBooking = await this.findByClientRequestId(clientRequestId);
        if (existingBooking) {
          return existingBooking;
        }
      }

      const booking = new Booking();
      booking.painterId = painterId;
      booking.customerId = customerId;
      booking.startTime = startTime;
      booking.endTime = endTime;
      booking.status = BookingStatus.CONFIRMED;
      if (clientRequestId) {
        booking.clientRequestId = clientRequestId;
      }

      const savedBooking = await queryRunner.manager.save(booking);
    
      await queryRunner.commitTransaction();
      
      return this.findById(savedBooking.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create booking: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findClosestAvailableSlots(
    startTime: Date,
    endTime: Date,
    limit: number = 3,
  ): Promise<BookingSuggestionDto[]> {
   
    const requestedDurationMs = endTime.getTime() - startTime.getTime();

    const result = await this.dataSource.query(`
      SELECT 
        u.id as painter_id,
        u.name as painter_name,
        a.start_time,
        a.end_time,
        EXTRACT(EPOCH FROM (a.end_time - a.start_time)) / 60 as duration_minutes
      FROM users u
      JOIN availabilities a ON u.id = a.user_id
      LEFT JOIN bookings b ON 
        u.id = b.painter_id AND 
        b.status != 'cancelled' AND 
        (tstzrange(b.start_time, b.end_time) && tstzrange(a.start_time, a.end_time))
      WHERE 
        b.id IS NULL AND
        u.role = 'painter' AND
        a.end_time - a.start_time >= $1 * interval '1 millisecond' AND
        a.start_time > CURRENT_TIMESTAMP AND
        a.start_time < CURRENT_TIMESTAMP + interval '14 days'
      ORDER BY a.start_time ASC
      LIMIT $2
    `, [requestedDurationMs, limit]);
    
    return result.map(row => {
      const slotStartTime = new Date(row.start_time);
      const slotEndTime = new Date(row.end_time);
      const slotDuration = slotEndTime.getTime() - slotStartTime.getTime();
      
      if (slotDuration > requestedDurationMs) {
        return {
          painterId: row.painter_id,
          painterName: row.painter_name,
          startTime: slotStartTime,
          endTime: new Date(slotStartTime.getTime() + requestedDurationMs),
          gapMinutes: Math.round((slotStartTime.getTime() - new Date().getTime()) / (60 * 1000))
        };
      } 
      
      return {
        painterId: row.painter_id,
        painterName: row.painter_name,
        startTime: slotStartTime,
        endTime: slotEndTime,
        gapMinutes: Math.round((slotStartTime.getTime() - new Date().getTime()) / (60 * 1000))
      };
    });
  }

  async cancelBooking(id: string): Promise<Booking> {
    await this.bookingRepository.update(id, { status: BookingStatus.CANCELLED });
    return this.findById(id);
  }
}
