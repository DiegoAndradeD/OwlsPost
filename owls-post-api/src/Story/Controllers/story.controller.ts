import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { StoryService } from "../Services/story.service";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";


@Controller('story')
export class StoryController {

    constructor(private readonly storyService: StoryService) {

    }

    @Get('all')
    async getAllStories(): Promise<Story[]> {
        return this.storyService.getAllStories();
    }

    @Post('add_story')
    async registerStory(@Body() storyDto: StoryDTO): Promise<Story> {
        return this.storyService.registerStory(storyDto);
    }

    @Get('get_user_stories/:userId')
    async getUserStories(@Param('userId') userId: number) {
        return this.storyService.getUserStories(userId);
    }

    @Get('user/:userId/get_story/:id')
    async getStoryById(@Param('userId') userId: number, @Param('id') id: number) {
        return this.storyService.getStoryById(userId, id);
    }

    @Get('get_story/:id')
    async getStoryOnlyByStoryId(@Param('id') id: number) {
        return this.storyService.getStoryOnlyByStoryId( id);
    }

    @Delete('user/:userId/delete_story/:id')
    async deleteStoryById(@Param('userId') userId: number, @Param('id') id: number) {
        return this.storyService.deleteStory(userId, id);
    }

}