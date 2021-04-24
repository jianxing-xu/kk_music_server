import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Song } from "src/entity/song";
import { SongController } from "./song.controller";
import { SongService } from "./song.service";


@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  exports: [SongService],
  providers: [SongService],
  controllers: [SongController],
})
export class SongMudule { }