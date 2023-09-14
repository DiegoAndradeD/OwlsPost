import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { Favorite } from "../Entity/favorite.entity";
import { FavoriteService } from "../Service/favorite.service";


@Controller('favorite')
export class FavoriteController {

    constructor(private readonly favoriteService: FavoriteService){}
    
    @Get()
    async getAllFavorites(): Promise<Favorite[]> {
        return this.favoriteService.getAllFavorites();
    }

    @Get('user/:userid/isFavorite/:storyid')
    async isFavorite(@Param('userid') userid: number, @Param('storyid') storyid: number): Promise<number> {
        return this.favoriteService.isStoryFavorite(userid, storyid);
    }

    @Post('user/:userid/addStory/:storyid/toFavorites')
    async addStoryToFavorites(@Param('userid') userid: number, @Param('storyid') storyid: number): Promise<Favorite> {
        return this.favoriteService.addStoryToFavorites(userid, storyid);
    }

    @Delete('user/:userid/deleteStory/:storyid/fromFavorites')
    async removeStoryFromFavorites(@Param('userid') userid: number, @Param('storyid') storyid: number): Promise<Favorite> {
        return this.favoriteService.removeStoryFromFavorites(userid, storyid);
    }
}