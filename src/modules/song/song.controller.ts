import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, RequestMapping, UseGuards } from "@nestjs/common";
import { Song } from "src/entity/song";
import { SongService } from "./song.service";


@Controller('song')
export class SongController {
  constructor(
    private readonly songService: SongService
  ) { }

  // 添加一首歌曲
  @Post('addSong')
  @HttpCode(HttpStatus.OK)
  async addSong(@Body() song: Partial<Song>) {
    await this.songService.addOne(song);
    return "Add Susccess !";
  }

  // 添加多首首歌曲
  @Post('addMulSong')
  @HttpCode(HttpStatus.OK)
  async addMulSong(@Body() songs: Array<Partial<Song>>) {
    await this.songService.addMulSong(songs);
    return "Add Susccess !";
  }

  @Get("findByIds/:ids")
  @HttpCode(HttpStatus.OK)
  async findByIds(@Param("ids") ids: string) {
    if (!!!ids) return [];
    const arr = ids.split(",");
    return this.songService.findByIds(arr);
  }
}