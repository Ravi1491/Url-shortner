import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    if (!req || !req.user) {
      return null;
    }

    return req.user as User;
  },
);
