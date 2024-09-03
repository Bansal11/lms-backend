import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: NextFunction) {
    const user = req['user'];

    if (user && user.role === 'admin') {
      next();
    } else {
      throw new ForbiddenException('You do not have admin privileges');
    }
  }
}
