import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlayList } from "./playlist";


@Entity()
export class Song {
  // 真实歌曲id
  @PrimaryColumn()
  id: number;

  // 歌名
  @Column()
  name: string;

  // 歌手
  @Column()
  artist: string;

  // 封面
  @Column()
  pic: string;

  // 歌单
  @ManyToMany(() => PlayList, playlist => playlist.musicList)
  playlists: PlayList[]


  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date

}