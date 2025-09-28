import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Availability } from './entities/availability.entity';
import { Booking } from './entities/booking.entity';
import { User } from '../authentication/entities/users.entity';
import { UserRepository } from '../authentication/repository/user.repository';
import { AvailabilityRepository } from './repositories/availability.repository';
import { BookingRepository } from './repositories/booking.repository';
import { AvailabilityService } from './services/availability.service';
import { BookingService } from './services/booking.service';
import { AvailabilityController } from './controllers/availability.controller';
import { BookingController } from './controllers/booking.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Availability, Booking]),
  ],
  controllers: [AvailabilityController, BookingController],
  providers: [
    UserRepository,
    AvailabilityRepository,
    BookingRepository,
    AvailabilityService,
    BookingService,
  ],
  exports: [AvailabilityService, BookingService],
})
export class SchedulingModule {}
