import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log('get user');
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);
    return request.user;
  },
);
