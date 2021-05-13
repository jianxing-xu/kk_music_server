import { createParamDecorator } from '@nestjs/common';

// 从req中获取user，参数装饰器
export const GetUser = createParamDecorator((data: string, req) => {
  return data ? req.user && req.user[data] : req.user;
});