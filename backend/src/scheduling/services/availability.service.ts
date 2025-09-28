import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AvailabilityRepository } from '../repositories/availability.repository';
import { UserRepository } from '../../authentication/repository/user.repository';
import { CreateAvailabilityDto, FilterAvailabilityDto } from '../dto/availability.dto';
import { Availability } from '../entities/availability.entity';
import { UserRole } from '../../authentication/entities/users.entity';

@Injectable()
export class AvailabilityService {
  private readonly logger = new Logger(AvailabilityService.name);

  constructor(
    private readonly availabilityRepository: AvailabilityRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createAvailability(userId: string, dto: CreateAvailabilityDto): Promise<Availability> {
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    this.validateTimeRange(startTime, endTime);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    this.logger.debug(`User role check: user.role=${user.role}, expected=${UserRole.PAINTER}`);
    
    if (user.role !== UserRole.PAINTER) {
      this.logger.error(`Authorization failed: User ${userId} with role ${user.role} tried to create availability, but only painters are allowed`);
      throw new BadRequestException('Only users with painter role can create availability slots');
    }
    
    this.logger.log(`User ${userId} with role ${user.role} authorized to create availability`);

    try {
      const availability = await this.availabilityRepository.create({
        userId,
        user,
        startTime,
        endTime,
      });
      
      this.logger.log(`Created availability for painter ${userId}: ${availability.id}`);
      return availability;
    } catch (error) {
      this.logger.error(`Failed to create availability: ${error.message}`, error.stack);
      if (error.message.includes('no_overlapping_availabilities')) {
        throw new BadRequestException(
          'This time slot overlaps with your existing availability. Please choose a different time.',
        );
      }
      throw error;
    }
  }

  async getPainterAvailabilities(userId: string): Promise<Availability[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    if (user.role !== UserRole.PAINTER) {
      throw new BadRequestException('Only users with painter role can view availability slots');
    }

    return this.availabilityRepository.findByUserId(userId);
  }

  async getAvailabilitiesByFilter(filter: FilterAvailabilityDto): Promise<Availability[]> {
    return this.availabilityRepository.findByFilter(filter);
  }

  async deleteAvailability(id: string, userId: string): Promise<void> {
    const availability = await this.availabilityRepository.findById(id);
    
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }

    if (availability.userId !== userId) {
      throw new BadRequestException('You can only delete your own availability slots');
    }

    await this.availabilityRepository.delete(id);
    this.logger.log(`Deleted availability ${id} for user ${userId}`);
  }

  async getAvailabilityById(id: string): Promise<Availability> {
    const availability = await this.availabilityRepository.findById(id);
    
    if (!availability) {
      throw new NotFoundException(`Availability with ID ${id} not found`);
    }
    
    return availability;
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
      throw new BadRequestException('Availability slot must be at least 15 minutes long');
    }
    
    // Validate maximum duration (e.g., 12 hours)
    const maximumDurationMs = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    if (endTime.getTime() - startTime.getTime() > maximumDurationMs) {
      throw new BadRequestException('Availability slot cannot be longer than 12 hours');
    }
  }
}
