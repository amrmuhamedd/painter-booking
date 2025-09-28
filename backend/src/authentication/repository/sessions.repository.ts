import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Session } from '../entities/sessions.entity';
import { User } from '../entities/users.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(session: Partial<Session>): Promise<Session> {
    const newSession = this.sessionRepository.create(session);
    return this.sessionRepository.save(newSession);
  }

  async findByToken(token: string): Promise<Session | null> {
    return this.sessionRepository.findOne({ where: { token } });
  }

  async findByUserId(id: string) {
    return this.sessionRepository.find({ 
      where: { user: { id } },
      relations: ['user']
    });
  }

  async deleteByUserId(id: string) {
    return this.sessionRepository.delete({ user: { id } });
  }

  async deleteByToken(token: string) {
    return this.sessionRepository.delete({ token });
  }

  async deleteExpiredSessions(userId: string, expirationTime: number) {
    const now = new Date();
    now.setTime(now.getTime() - expirationTime);

    return this.sessionRepository.delete({
      user: { id: userId },
      updatedAt: LessThan(now)
    });
  }
}
