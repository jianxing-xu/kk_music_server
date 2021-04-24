
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { hashSync, compareSync } from 'bcryptjs';
import { Exclude } from "class-transformer";
import { PlayList } from "./playlist";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  /**
 * 检测密码是否一致
 * @param password0 加密前密码
 * @param password1 加密后密码
 */
  static async comparePassword(password0, password1) {
    return compareSync(password0, password1);
  }

  static encryptPassword(password) {
    return hashSync(password, 10);
  }
  // 用户名
  @Column({ default: null })
  username: string;

  // 密码
  @Exclude()
  @Column({ default: null })
  password: string;

  // 头像
  @Column({ default: null })
  avatar: string;

  // 听歌总数
  @Column({ default: 0, name: 'listen_count' })
  listenCount: number;

  // 最近播放 存储歌曲id 1,2,3,5
  @Column({ default: "", name: 'recent_play' })
  recentPlay: string;

  // 我的收藏 存储歌曲id 1,2,3,5
  @Column({ default: "" })
  favorites: string;

  // 我的歌单
  @OneToMany(() => PlayList, playlist => playlist.auther)
  playList: PlayList[];

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date

  @UpdateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'update_at',
  })
  updateAt: Date

}