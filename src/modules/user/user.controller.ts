import {
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Get,
  Request,
  Param,
} from '@nestjs/common';
import { User } from 'src/entity/user';
import { GetUser } from 'src/utils/user.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RegisterDTO } from './dto/register.dio';
import { UserService } from './user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * 用户注册
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() data: RegisterDTO) {
    const user = new User();
    user.username = data.username;
    user.password = data.password;
    return this.userService.createUser(user);
  }

  /**
   * 查找用户信息
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('userinfo')
  @HttpCode(HttpStatus.OK)
  async findUserInfo(@GetUser() user) {
    const data = await this.userService.findOne({ id: user.id });
    return data;
  }

  /**
   * 更新用户昵称
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('updateInfo/:username')
  @HttpCode(HttpStatus.OK)
  async updateInfo(@GetUser() user, @Param("username") username) {
    return this.userService.updateUser(user.id, { username });
  }
  /**
   * 更新用户密码
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('updatePwd/:oldpwd/:newpwd')
  @HttpCode(HttpStatus.OK)
  async updatePwd(@GetUser() user, @Param("oldpwd") oldpwd: string, @Param("newpwd") newpwd: string) {
    return this.userService.updatePassword(user.id, oldpwd, newpwd);
  }
  /**
   * 增加听歌总数
   */
  @UseGuards(JwtAuthGuard)
  @Get('addListenCount')
  @HttpCode(HttpStatus.OK)
  async addListenCount(@GetUser() user: User) {
    await this.userService.addListenCount(user);
    return "Add Success !";
  }

  @UseGuards(JwtAuthGuard)
  @Get('addRecentPlay/:musicId')
  @HttpCode(HttpStatus.OK)
  async addRecentPlay(@GetUser() user: User, @Param('musicId') musicId: string, @Request() req: Request) {
    await this.userService.addRecentPlay(musicId, user.id);
    return "Add Success";
  }

  @UseGuards(JwtAuthGuard)
  @Get('toggleFavorite/:musicId')
  @HttpCode(HttpStatus.OK)
  async toggleFavorite(@Param('musicId') musicId: string, @GetUser() user: User) {
    const flag = await this.userService.toggleFavorite(musicId, user.id);
    return flag;
  }

  @UseGuards(JwtAuthGuard)
  @Get('favoriteMulSong/:ids')
  @HttpCode(HttpStatus.OK)
  async favoriteMulSong(@Param('ids') ids: string, @GetUser() user: User) {
    const flag = await this.userService.favoriteMulSong(ids, user.id);
    return flag;
  }

}
