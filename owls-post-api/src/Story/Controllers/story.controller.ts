import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { StoryService } from "../Services/story.service";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";
import { AuthService } from 'src/Auth/Services/auth.service';

@Controller('story')
export class StoryController {

    constructor(private readonly storyService: StoryService,
      private readonly authService: AuthService) {}

    // Get all stories
    @Get('all')
    async getAllStories(): Promise<Story[]> {
        return this.storyService.getAllStories();
    }

    // Register a new story
    @Post('add_story')
    async registerStory(@Body() storyDto: StoryDTO, @Req() req: Request,
    @Res() res: Response,): Promise<void> {
        const authHeader = req.headers.authorization;
  
        const token = this.authService.getTokenAuthHeader(authHeader)
        try {
            const story = await this.storyService.registerStory(storyDto, await token);
            res.status(201).json(story); 
          } catch (error) {
            console.error('Error registering story:', error);
            res.status(500).json({ error: 'Failed to register the story' });
          }
    }



    // Get all stories of a user by user ID
    @Get('get_user_stories/:userId')
    async getUserStories(@Param('userId') userId: number) {
        return this.storyService.getUserStories(userId);
    }

    // Get a story by user ID and story ID
    @Get('user/:userId/get_story/:id')
    async getStoryById(@Param('userId') userId: number, @Param('id') id: number) {
        return this.storyService.getStoryById(userId, id);
    }

    // Get a story by story ID only
    @Get('get_story/:id')
    async getStoryOnlyByStoryId(@Param('id') id: number) {
        return this.storyService.getStoryOnlyByStoryId(id);
    }

    // Delete a story by user ID and story ID
    @Delete('user/:userId/delete_story/:id')
    async deleteStoryById(@Param('userId') userId: number, @Param('id') id: number) {
        return this.storyService.deleteStory(userId, id);
    }

    // Get stories by title
    @Get('getStoryByTitle/:title')
    async getStoryByTitle(@Param('title') title: string): Promise<Story[]> {
        return this.storyService.getStoryByTitle(title);
    }

    // Get stories by tags
    @Get('getStoriesByTags')
    async getStoriesByTags(@Query('tags') tags: string): Promise<Story[]> {
      const tagsArray = tags.split(',').map(tag => tag.trim()); 
      console.log(tagsArray)
      return this.storyService.getStoriesByTags(tagsArray);
    }
}
