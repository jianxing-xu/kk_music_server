import { Body, Controller, HttpCode, HttpStatus, Post, RequestMapping, UseGuards } from "@nestjs/common";
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
}