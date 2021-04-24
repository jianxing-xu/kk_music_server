import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// 鉴权模块
import { AuthModule } from './modules/auth/auth.module';
// 配置文件
import { config } from './config';
import { UserModule } from './modules/user/user.module';

// 用户模块
import { User } from './entity/user'
import { PlayList } from './entity/playlist';
import { Song } from './entity/song';
import { SongMudule } from './modules/song/song.module';
import { PlayListMudule } from './modules/playlist/playlist.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      ...config.mysql,
      entities: [
        User,
        PlayList,
        Song
      ],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    SongMudule,
    PlayListMudule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
