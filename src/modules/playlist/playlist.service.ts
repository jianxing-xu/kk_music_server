import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlayList } from "src/entity/playlist";
import { unique } from "src/utils/tools_func";
import { Repository } from "typeorm";
import { SongService } from "../song/song.service";
import { UserService } from "../user/user.service";
import { CreateOneDTO } from "./dto/create_one.dto";



@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlayList)
    private readonly playlistRepository: Repository<PlayList>,
    private readonly songService: SongService,
    private readonly userService: UserService
  ) { }

  async findOne(playlist: Partial<PlayList>) {
    return this.playlistRepository.findOne({ where: { ...playlist } })
  }

  async findAllById(userId: number) {
    const list = await this.playlistRepository.find({ where: { autherId: userId }, relations: ['musicList'] });
    return list;
  }

  // 创建一个歌单
  async createOne(userId: number, name: string) {
    const exist = await this.findOne({ name });
    if (!!exist) {
      throw new HttpException("歌单已存在", HttpStatus.BAD_REQUEST);
    }
    try {
      const playlist = this.playlistRepository.create();
      const auther = await this.userService.findOne({ id: userId });
      delete auther.password;
      Object.assign(playlist, { name, auther });
      return this.playlistRepository.save(playlist);
    } catch (error) {
      console.log(error);
      throw new HttpException("系统错误", HttpStatus.BAD_REQUEST);
    }
  }

  // 删除一个个案
  async removeOne(playlistId: number) {
    try {
      await this.playlistRepository.delete([playlistId]);
    } catch (error) {
      throw new HttpException("系统错误", HttpStatus.OK);
    }
  }

  /**
   * 添加歌曲到歌单
   * @param musicIds 歌曲ids
   * @param playlistId 歌单id
   */
  async addSongToPlayList(musicIds: string, playlistId: number) {

    try {
      const existPlaylist = await this.playlistRepository.findOne(playlistId, { relations: ['musicList'] });
      if (!!!existPlaylist) throw "歌单不存在";
      const insertSongs = await this.songService.findByIds(musicIds.split(","));
      const newSongs = [...existPlaylist.musicList, ...insertSongs];

      existPlaylist.musicList = unique(newSongs, 'id');
      existPlaylist.totalCount = newSongs.length;
      await this.playlistRepository.save(existPlaylist);
    } catch (error) {
      console.log(error);
      throw new HttpException("系统错误" + error, HttpStatus.BAD_REQUEST);
    }
  }

  /**
  * 移除歌单中歌曲
  * @param musicIds 歌曲ids
  * @param playlistId 歌单id
  */
  async removeSongForPlayList(musicIds: string, playlistId: number) {
    try {
      const existPlaylist = await this.playlistRepository.findOne(playlistId, { relations: ['musicList'] });
      const idsArr = musicIds.split(",");
      existPlaylist.musicList = existPlaylist.musicList.filter((song, i) => idsArr.indexOf(song.id + ''));
      this.playlistRepository.save(existPlaylist);
    } catch (error) {
      throw new HttpException("系统错误", HttpStatus.BAD_REQUEST);
    }
  }


  async findById(id: string) {
    return this.playlistRepository.findOne({ where: { id }, relations: ['musicList'] })
  }

  // 删除多个歌单
  async removeMulPlaylist(ids: string) {
    try {
      await this.playlistRepository.createQueryBuilder().delete().from(PlayList).whereInIds(ids).printSql().execute();
    } catch (error) {
      console.log(error);
      throw new HttpException("系统错误", HttpStatus.BAD_REQUEST);
    }
  }

}