import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDTO } from '../user/dto/register.dio';
import { UserService } from '../user/user.service';
import { User } from 'src/entity/user';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) { }

  // 创建token
  createToken(user: Partial<any>) {
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }

  // 返回带token的用户信息
  async login(data: RegisterDTO) {
    const user = await this.valiedateUser(data);
    const token = this.createToken({
      ...user
    });
    // 排除密码不返回
    var { password, ...other } = user;
    return {
      ...other,
      token
    };
  }

  // 验证用户的账号密码
  async valiedateUser(data: RegisterDTO): Promise<User> {
    try {
      const user = await this.userService.findOne({ username: data.username });
    if (!!user) {
      const flag = await User.comparePassword(data.password, user.password);
      if (flag) {
        return user;
      } else {
        throw new HttpException("密码错误", HttpStatus.BAD_REQUEST);
      }
    } else {
      throw new HttpException("用户名或密码错误", HttpStatus.BAD_REQUEST);
    }
    } catch (error) {
      throw error;
    }
  }
}
