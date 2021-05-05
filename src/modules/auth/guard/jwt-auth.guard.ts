import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


// 应用在 Controller 上的wjwt守卫，用于触发jwt验证，使用的是jwt策略
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // canActivate(context: ExecutionContext) {
  //   return super.canActivate(context);
  // }
  // 拿到请求对象
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    return request;
  }
  // 只要实现了,这个方法,jwt校验失败就不会自动抛出异常，需要手动根据用户信息抛出异常
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (err || !user) {
      throw new HttpException("身份验证失败",HttpStatus.FORBIDDEN);
    }
    // 通过获取请求对象，将 token 中解析出来的数据送入到请求对象中，以便于到 Controller 中能够访问到
    this.getRequest(context).user = user;
    return user;
  }
}
