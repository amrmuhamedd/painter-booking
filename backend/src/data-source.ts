import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './authentication/entities/users.entity';
import { Session } from './authentication/entities/sessions.entity';
import { Availability } from './scheduling/entities/availability.entity';
import { Booking } from './scheduling/entities/booking.entity';


config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Session, Availability, Booking],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
