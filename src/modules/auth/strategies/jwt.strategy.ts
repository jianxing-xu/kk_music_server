import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { config } from 'src/config';


// 用于验证jwt的策略
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secretOrKey
    });
  }
  // 通过验证后的回调,这里的返回值将送到jwt-auto-Guard.handleRequest中
  async validate(payload: any) {
    return payload;
  }
}