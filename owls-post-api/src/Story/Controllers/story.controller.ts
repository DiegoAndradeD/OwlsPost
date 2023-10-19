/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, Post, Query, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { StoryService } from "../Services/story.service";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";
import { AuthService } from '../../Auth/Services/auth.service';
import { AuthMiddleware } from '../../Auth/auth.middleware';

@Controller('story')
export class StoryController {

    constructor(private readonly storyService: StoryService,
      private readonly authService: AuthService) {}

    // Get all stories
    @Get('all')
    async getAllStories(): Promise<Story[]> {
        try {
            return this.storyService.getAllStories();
        } catch (error) {
            throw new InternalServerErrorException('Error getting all stories')
        }
       
    }

    // Register a new story
    @Post('add_story')
    @UseGuards(AuthMiddleware)
    async registerStory(@Body() storyDto: StoryDTO, @Req() req: Request,
                       @Res() res: Response): Promise<void> {
        try {
            const story = await this.storyService.registerStory(storyDto);
            res.status(HttpStatus.CREATED).json(story);
        } catch (error) {
            console.error('Error registering story:', error);
            if (error instanceof BadRequestException) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
            } else if (error instanceof UnauthorizedException) {
                res.status(HttpStatus.UNAUTHORIZED).json({ error: error.message });
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Failed to register the story' });
            }
        }
    }



    // Get all stories of a user by user ID
    @Get('get_user_stories/:userId')
    async getUserStories(@Param('userId') userId: number) {
        try {
            return this.storyService.getUserStories(userId);
        } catch (error) {
            throw new InternalServerErrorException('Error getting user stories')
        }
        
    }

    // Get a story by user ID and story ID
    @Get('user/:userId/get_story/:id')
    async getStoryById(@Param('userId') userId: number, @Param('id') id: number) {
        try {
            return this.storyService.getStoryById(userId, id);
        } catch (error) {
            throw new InternalServerErrorException('Error getting story by id and user id')
        }
        
    }

    // Get a story by story ID only
    @Get('get_story/:id')
    async getStoryOnlyByStoryId(@Param('id') id: number) {
        try {
            return this.storyService.getStoryOnlyByStoryId(id);
        } catch (error) {
            throw new InternalServerErrorException('Error getting story by story id')
        }

    }

    // Delete a story by user ID and story ID
    @Delete('user/:userId/delete_story/:id')
    @UseGuards(AuthMiddleware)
    async deleteStoryById(@Param('userId') userId: number, @Param('id') id: number, @Req() req: Request,
    @Res() res: Response) {
        try {
            const deleteStory =  this.storyService.deleteStory(userId, id);
            res.status(HttpStatus.NO_CONTENT).json(deleteStory); 
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(HttpStatus.UNAUTHORIZED).json({error: error.message});
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
            }
        }

    }

    // Get stories by title
    @Get('getStoryByTitle/:title')
    async getStoryByTitle(@Param('title') title: string): Promise<Story[]> {
        try {
            return this.storyService.getStoryByTitle(title);
        } catch (error) {
            throw new InternalServerErrorException('Error getting story by title')
        }
        
    }

    // Get stories by tags
    @Get('getStoriesByTags')
    async getStoriesByTags(@Query('tags') tags: string): Promise<Story[]> {
      const tagsArray = tags.split(',').map(tag => tag.trim()); 
      try {
        return this.storyService.getStoriesByTags(tagsArray);
      } catch (error) {
        throw new InternalServerErrorException('Error getting stories by tags')
      }
      
    }
}
