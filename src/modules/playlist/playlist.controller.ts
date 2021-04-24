import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Request, RequestMapping, UseGuards } from "@nestjs/common";
import { User } from "src/entity/user";
import { GetUser } from "src/utils/user.decorator";
import { JwtAuthGuard } from "../auth/guard/jwt-auth.guard";
import { CreateOneDTO } from "./dto/create_one.dto";
import { PlaylistService } from "./playlist.service";


@Controller('playlist')
export class PlaylistController {
  constructor(
    private readonly playlistService: PlaylistService
  ) { }

  // 创建歌单
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(@GetUser() user: User, @Body() data: CreateOneDTO) {
    return this.playlistService.createOne(user.id, data);
  }

  // 删除歌单
  @UseGuards(JwtAuthGuard)
  @Post('remove/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@GetUser() user: User, @Param("id") id: number) {
    return this.playlistService.removeOne(id);
  }

  // 添加歌曲到歌单
  @UseGuards(JwtAuthGuard)
  @Post('addToPlaylist/:id')
  @HttpCode(HttpStatus.OK)
  async addToPlaylist(@Query('ids') ids: string, @Param('id') id: string) {
    await this.playlistService.addSongToPlayList(ids, parseInt(id));
    return "Add Success";
  }

  // 移除歌单中歌曲
  @UseGuards(JwtAuthGuard)
  @Post('removeForPlaylist/:id')
  @HttpCode(HttpStatus.OK)
  async removeSongForPlaylist(@Query('ids') ids: string, @Param('id') id: string) {
    await this.playlistService.removeSongForPlayList(ids, parseInt(id));
    return "Remove Success";
  }

  // 
  @UseGuards(JwtAuthGuard)
  @Get('findAllByUser')
  @HttpCode(HttpStatus.OK)
  async findAllByUserId(@GetUser() user: User) {
    return this.playlistService.findAllById(user.id);
  }

}