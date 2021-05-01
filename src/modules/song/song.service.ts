import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Song } from "src/entity/song";
import { Repository } from "typeorm";



@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>
  ) { }

  /**
   * 根据歌曲id数组查找
   * @param ids Array
   * @returns 
   */
  async findByIds(ids: Array<string>) {
    try {
      return (await this.songRepository.findByIds(ids)).sort((a, b) => {
        return new Date(a.createAt).getMilliseconds() - new Date(b.createAt).getMilliseconds();
      });
    } catch (error) {
      console.log(error);
      throw new HttpException("查找歌曲出错", HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(song: Partial<Song>) {
    return this.songRepository.findOne({ where: { ...song } });
  }

  async addMulSong(songs: Array<Partial<Song>>) {
    try {
      let ins = songs.map((song) => this.songRepository.create(song));
      const existSongs = await this.songRepository.findByIds(ins.map(v => v.id));
      ins = ins.filter((song) => {
        const idx = existSongs.findIndex(v => v.id == song.id)
        return !~idx;
      });
      
      if (ins.length == 0) return;
      await this.songRepository.insert(ins);
    } catch (error) {
      console.log(error);
      throw new HttpException("插入出错", HttpStatus.BAD_REQUEST);
    }
  }

  async addOne(song: Partial<Song>) {
    try {
      const exist = await this.findOne(song);
      if (!!exist) {
        throw new HttpException("歌曲已存在", HttpStatus.BAD_REQUEST);
      }
      const newSong = this.songRepository.create(song);
      await this.songRepository.save(newSong);
    } catch (error) {
      throw error;
    }
  }

  async save(song: Song) {
    this.songRepository.save(song);
  }

}