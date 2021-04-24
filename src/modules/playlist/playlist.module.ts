import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayList } from "src/entity/playlist";
import { SongMudule } from "../song/song.module";
import { UserModule } from "../user/user.module";
import { PlaylistController } from "./playlist.controller";
import { PlaylistService } from "./playlist.service";


@Module({
  imports: [TypeOrmModule.forFeature([PlayList]), SongMudule, UserModule],
  exports: [PlaylistService],
  providers: [PlaylistService],
  controllers: [PlaylistController],
})
export class PlayListMudule { }