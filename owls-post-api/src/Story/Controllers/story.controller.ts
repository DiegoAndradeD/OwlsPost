import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { StoryService } from "../Services/story.service";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";


@Controller('story')
export class StoryController {

    constructor(private readonly storyService: StoryService) {

    }

    @Get()
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

}