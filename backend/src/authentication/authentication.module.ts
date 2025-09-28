import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { User } from './entities/users.entity';
import { UserRepository } from './repository/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { Session } from './entities/sessions.entity';
import { SessionsRepository } from './repository/sessions.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.stratgy';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, Session]),
    JwtModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtStrategy,
    UserRepository,
    SessionsRepository,
  ],
  exports: [
    UserRepository,
  ],
})
export class AuthenticationModule {}
