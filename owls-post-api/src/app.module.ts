import { Module } from '@nestjs/common';
import { UserModule } from './User/Modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Auth/Modules/auth.module';
import { StoryModule } from './Story/Modules/story.module';
import { ChapterModule } from './Chapter/Modules/chapter.module';
import { FollowerModule } from './Follower/Modules/follower.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: Number[process.env.DB_PORT],
      username: process.env.DB_USERNAME,
      entities: [`${__dirname}/**/*.entity{.js,.ts}`],
      migrations: [`${__dirname}/migration/{*.js,.ts}`],
      migrationsRun: true,
    }),
    UserModule,
    AuthModule,
    StoryModule,
    ChapterModule,
    FollowerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
