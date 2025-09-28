import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Session } from './sessions.entity';
import { Availability } from '../../scheduling/entities/availability.entity';
import { Booking } from '../../scheduling/entities/booking.entity';

export enum UserRole {
  CUSTOMER = 'customer',
  PAINTER = 'painter',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  email: string;
  
  @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;
  
  @Column({ nullable: true })
  phone: string;
  
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, default: 0 })
  rating: number;
  
  @Column({ nullable: true })
  location: string;
  
  @Column({ nullable: true })
  specialization: string;
  
  @Column({ nullable: true, type: 'integer' })
  experience: number;
  
  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  hourlyRate: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];
  
  @OneToMany(() => Availability, (availability) => availability.user)
  availabilities: Availability[];
  
  @OneToMany(() => Booking, (booking) => booking.painter)
  painterBookings: Booking[];
  
  @OneToMany(() => Booking, (booking) => booking.customer)
  customerBookings: Booking[];
}
