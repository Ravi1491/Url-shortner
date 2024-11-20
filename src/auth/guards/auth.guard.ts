import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '../decorators/public';
import { isPresent } from 'src/utils/helper';
import { UserService } from 'src/user/user.service';
import { applicationConfig } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const serverClient = ['glue-admin-client', 'xg-client'];

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const headers = request.headers;

    // bypass auth-guard for server to server communication
    if (isPresent(headers.client) && serverClient.includes(headers.client)) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decode: { id: string } = await this.jwtService.verifyAsync(token, {
        secret: applicationConfig.jwt.secret,
      });

      const user = await this.userService.findOne(decode.id);

      if (!user) {
        throw new Error('User not found');
      }

      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
