import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from '../entities/availability.entity';
import { FilterAvailabilityDto } from '../dto/availability.dto';

@Injectable()
export class AvailabilityRepository {
  constructor(
    @InjectRepository(Availability)
    private availabilityRepository: Repository<Availability>,
  ) {}

  async findById(id: string): Promise<Availability> {
    return this.availabilityRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });
  }

  async create(data: Partial<Availability>): Promise<Availability> {
    const availability = this.availabilityRepository.create(data);
    return this.availabilityRepository.save(availability);
  }

  async update(id: string, data: Partial<Availability>): Promise<Availability> {
    await this.availabilityRepository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.availabilityRepository.delete(id);
  }

  async findByUserId(userId: string): Promise<Availability[]> {
    return this.availabilityRepository.find({
      where: { userId },
      order: { startTime: 'ASC' },
    });
  }

  async findAvailableForTimeSlot(startTime: Date, endTime: Date): Promise<Availability[]> {
    return this.availabilityRepository
      .createQueryBuilder('availability')
      .innerJoinAndSelect('availability.user', 'user')
      .where('availability.start_time <= :startTime', { startTime })
      .andWhere('availability.end_time >= :endTime', { endTime })
      .andWhere('user.role = :role', { role: 'painter' })
      .orderBy('user.rating', 'DESC')
      .getMany();
  }

  async findByFilter(filter: FilterAvailabilityDto): Promise<Availability[]> {
    const query = this.availabilityRepository.createQueryBuilder('availability')
      .innerJoinAndSelect('availability.user', 'user')
      .where('user.role = :role', { role: 'painter' });
    
    if (filter.painterId) {
      query.andWhere('availability.user_id = :painterId', { painterId: filter.painterId });
    }
    
    if (filter.startDate) {
      query.andWhere('availability.end_time > :startDate', { startDate: filter.startDate });
    }
    
    if (filter.endDate) {
      query.andWhere('availability.start_time < :endDate', { endDate: filter.endDate });
    }
    
    return query.orderBy('availability.start_time', 'ASC').getMany();
  }
}
