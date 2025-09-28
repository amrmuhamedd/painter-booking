// JwtStrategy
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repository/user.repository';
import { SessionsRepository } from '../repository/sessions.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly sessionRepository: SessionsRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: { id: string; role?: string }) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If role is in the payload, use it, otherwise get it from the user object
    // This ensures backward compatibility with existing tokens
    const role = payload.role || user.role;
    return { id: user.id, email: user.email, name: user.name, role };
  }
}
