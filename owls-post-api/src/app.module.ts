import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserModule } from './User/Modules/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './Auth/Modules/auth.module';
import { StoryModule } from './Story/Modules/story.module';
import { ChapterModule } from './Chapter/Modules/chapter.module';
import { FollowerModule } from './Follower/Modules/follower.module';
import { FavoriteModule } from './Favorite/Module/favorite.module';
import { AuthMiddleware } from './Auth/auth.middleware';

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
    FollowerModule,
    FavoriteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'story/add_story', method: RequestMethod.POST },
        {path: 'story/user/:userId/delete_story/:id', method: RequestMethod.DELETE },
        {path: 'user/userid/:userid/changeDescriptionTo', method: RequestMethod.PUT},
        {path: 'follower/userid/:userid/to_follow_userid/:to_follow_userid', method: RequestMethod.PUT},
        {path: 'follower/userid/:userid/to_unfollow_userid/:to_follow_userid', method: RequestMethod.DELETE},
        {path: 'favorite/user/:userid/addStory/:storyid/toFavorites', method: RequestMethod.POST},
        {path: 'favorite/user/:userid/deleteStory/:storyid/fromFavorites', method: RequestMethod.DELETE},
        {path: 'chapter/:id/add-chapter', method: RequestMethod.POST},
        {path: 'chapter/story/:storyid/delete_chapter/:id', method: RequestMethod.DELETE},
        {path: 'chapter/update/:storyid/update_chapter/:id', method: RequestMethod.PUT}, 
        {path: 'auth/change-username', method: RequestMethod.POST},
        {path: 'auth/change-email', method: RequestMethod.POST},
        {path: 'auth/change-password', method: RequestMethod.POST},
        );
  }
}
