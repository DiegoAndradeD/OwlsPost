import { Body, Controller, Get, Post } from "@nestjs/common";
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
        console.log(storyDto);
        return this.storyService.registerStory(storyDto);
    }

}