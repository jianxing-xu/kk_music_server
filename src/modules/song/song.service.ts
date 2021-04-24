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
  async findByIds(ids: Array<any>) {
    return this.songRepository.findByIds(ids);
  }

  async findOne(song: Partial<Song>) {
    return this.songRepository.findOne({ where: { ...song } });
  }

  async addOne(song: Partial<Song>) {
    const exist = await this.findOne(song);
    if (!!exist) {
      throw new HttpException("歌曲已存在", HttpStatus.BAD_REQUEST);
    }
    const newSong = this.songRepository.create(song);
    this.songRepository.save(newSong);
  }

  async save(song: Song) {
    this.songRepository.save(song);
  }

}