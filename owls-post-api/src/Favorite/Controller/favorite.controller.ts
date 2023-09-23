import { Controller, Delete, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Favorite } from "../Entity/favorite.entity";
import { FavoriteService } from "../Service/favorite.service";


@Controller('favorite')
export class FavoriteController {

    constructor(private readonly favoriteService: FavoriteService){}
    
    @Get()
    async getAllFavorites(): Promise<Favorite[]> {
        try {
            return this.favoriteService.getAllFavorites();
        } catch (error) {
            throw new HttpException('Error gettig all favorites', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @Get('user/:userid/isFavorite/:storyid')
    async isFavorite(@Param('userid') userid: number, @Param('storyid') storyid: number): Promise<number> {
        try {
            return this.favoriteService.isStoryFavorite(userid, storyid);
        } catch (error) {
            throw new HttpException('Error checking if story is favorite', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    @Post('user/:userid/addStory/:storyid/toFavorites')
    async addStoryToFavorites(@Param('userid') userid: number, @Param('storyid') storyid: number): Promise<Favorite> {
        try {
            return this.favoriteService.addStoryToFavorites(userid, storyid);
        } catch (error) {
            throw new HttpException('Error adding story to favorite', HttpStatus.BAD_REQUEST);
        }
        
    }

    @Delete('user/:userid/deleteStory/:storyid/fromFavorites')
    async removeStoryFromFavorites(@Param('userid') userid: number, @Param('storyid') storyid: number): Promise<Favorite> {
        try {
            return this.favoriteService.removeStoryFromFavorites(userid, storyid);
        } catch (error) {
            throw new HttpException('Error deleting story from favorite', HttpStatus.BAD_REQUEST);
        }
        
    }

    @Get('get_user/:userid/favoriteStories')
    async getUserFavoriteStories(@Param('userid') userid: number): Promise<Favorite[]> {
        try {
            return this.favoriteService.getUserFavoriteStories(userid);
        } catch (error) {
            throw new HttpException('Error getting user favorites stories', HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}