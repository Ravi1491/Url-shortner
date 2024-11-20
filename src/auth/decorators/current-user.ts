import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator((context: ExecutionContext) => {
  const req: { user: User } = context.switchToHttp().getRequest();

  return req.user as User;
});
