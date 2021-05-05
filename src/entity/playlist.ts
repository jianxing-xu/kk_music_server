import { Column, CreateDateColumn, Entity, Generated, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Song } from "./song";
import { User } from "./user";


@Entity()
export class PlayList {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // 歌单名
  @Column({ default: null })
  name: string;

  // 歌单封面
  @Column({ default: null })
  pic: string;

  // 歌单歌曲id
  // @Column({ default: "" }) //存储歌曲id 34,3,2,3,4
  @ManyToMany(() => Song, song => song.playlists)
  @JoinTable()
  musicList: Song[];

  // 歌单 歌曲数
  @Column({ default: 0, name: 'total_count' })
  totalCount: number;

  // 歌单简介
  @Column()
  info: string;

  @ManyToOne(() => User, (user) => user.playList)
  auther: User

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