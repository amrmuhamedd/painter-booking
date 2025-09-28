import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../entities/users.entity';

@Injectable()
export class PainterGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    
    if (user.role !== UserRole.PAINTER) {
      throw new ForbiddenException('Access denied. Only painters can access this resource.');
    }
    
    return true;
  }
}
