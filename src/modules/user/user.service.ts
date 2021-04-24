import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/entity/song';
import { User } from 'src/entity/user';
import { Repository } from 'typeorm';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepostory: Repository<User>
  ) {
  }

  async findOne(user: Partial<User>) {
    return this.userRepostory.findOne({ where: { ...user }, relations: ['playList'] });
  }

  // 创建一个用户
  async createUser(user: User): Promise<User | undefined> {
    const exist = await this.findOne(user);
    if (!!exist) {
      throw new HttpException("用户名已存在", HttpStatus.BAD_REQUEST);
    }
    try {
      const newUser = this.userRepostory.create(user);
      newUser.password = User.encryptPassword(newUser.password);
      this.userRepostory.save(newUser);
      return newUser;
    } catch (error) {
      console.log(error);
      throw new HttpException("数据库操作失败", HttpStatus.BAD_REQUEST);
    }
  }


  // 增加听歌总数
  async addListenCount(user: User) {
    const exist = await this.findOne(user);
    exist.listenCount++;
    await this.userRepostory.save(exist);
  }

  // 更新用户信息
  async updateUser(id: number, user: Partial<User>) {
    try {
      const exist = await this.findOne({ id });
      const newUser = this.userRepostory.merge(exist, user);
      await this.userRepostory.save(newUser);
      console.log(newUser);
      return newUser;
    } catch (error) {
      throw new HttpException("更新出错", HttpStatus.BAD_REQUEST);
    }
  }

  async updatePassword(id: number, oldPwd: string, newPwd: string) {
    try {
      const exist = await this.findOne({ id });
      const flag = await User.comparePassword(oldPwd, exist.password)
      if (flag) {
        const encodeNewPwd = User.encryptPassword(newPwd);
        exist.password = encodeNewPwd;
        await this.userRepostory.save(exist);
      }
    } catch (error) {
      throw new HttpException("旧密码错误", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 添加最近播放，
   * @param song 歌曲
   * @param userId 用户id
   */
  async addRecentPlay(musicId: string, userId: number) {
    const exist = await this.findOne({ id: userId });
    exist.recentPlay += exist.recentPlay.length == 0 ? musicId : `,${musicId}`;
    await this.userRepostory.save(exist);
  }

  /**
   * 我的收藏: 已收藏则取消，未收藏则收藏
   * @param song 歌曲
   * @param userId 用户id
   */
  async toggleFavorite(musicId: string, userId: number) {
    const exist = await this.findOne({ id: userId });
    const arr = exist.favorites.split(",");
    const idx = arr.indexOf(musicId);
    if (~idx) {
      arr.splice(idx, 1);
    } else {
      arr.push(musicId);
    }
    exist.favorites = arr.join(",");
    await this.userRepostory.save(exist);
  }


}
