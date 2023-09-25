import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, Param, Post, Put, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChapterService } from "../Services/chapter.service";
import { Chapter } from "../Entities/chapter.entity";
import { ChapterDto } from "../Dto/chapter.dto";
import { AuthService } from 'src/Auth/Services/auth.service';
import { blob } from 'stream/consumers';

@Controller('chapter')
export class ChapterController {

    constructor(private readonly chapterService: ChapterService, private readonly authService: AuthService) {}

    // Get all chapters
    @Get()
    async getAllChapters(): Promise<Chapter[]> {
        return this.chapterService.getAllChapters();
    }

    // Add a new chapter to a story by ID
    @Post(':id/add-chapter')
    async addChapter(@Body() chapterDto: ChapterDto, @Req() req: Request, @Res() res: Response): Promise<void> {
        try {
            const authHeader = req.headers.authorization;
            const token = this.authService.getTokenAuthHeader(authHeader);
            const chapter = await this.chapterService.addChapter(chapterDto, await token);
            res.status(201).json(chapter);
        } catch (error) {
            if(error instanceof BadRequestException) {
                res.status(HttpStatus.BAD_REQUEST).json({error: error.message});
            } else if(error instanceof UnauthorizedException) {
                res.status(HttpStatus.UNAUTHORIZED).json({erro: error.message});
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: 'Failed to add chapter'});
            }
        }
    }

    // Get all chapters of a story by its ID
    @Get('getStory/:id/chapters')
    async getChaptersById(@Param('id') id: number): Promise<Chapter[]> {
        return this.chapterService.getChaptersById(id);
    }

    // Get a specific chapter by its ID
    @Get('getChapter/:id')
    async getChapterById(@Param('id') id: number): Promise<Chapter> {
        return this.chapterService.getChapterById(id);
    }

    @Delete('story/:storyid/delete_chapter/:id')
    async deleteChapterById(@Param('storyid') storyid: number, @Param('id') id: number, @Req() req: Request,
    @Res() res: Response) {
        try {
            const authHeader = req.headers.authorization;
            const token = this.authService.getTokenAuthHeader(authHeader)
            const deleteChapter =  this.chapterService.deleteChapter(storyid, id, await token);
            res.status(204).json(deleteChapter); 
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(HttpStatus.UNAUTHORIZED).json({error: error.message});
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
            }
        }

    }

    @Put('/update/:storyid/update_chapter/:id')
    async updateChapterById(@Param('storyid') storyid: number, @Param('id') id: number, @Req() req: Request,
    @Res() res: Response, @Body() body: {title: string, content: string}) {
        try {
            const authHeader = req.headers.authorization;
            const token = this.authService.getTokenAuthHeader(authHeader)
            const updateChapter =  this.chapterService.updateChapter(body.title, body.content, storyid, id, await token);
            res.status(200).json(updateChapter); 
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(HttpStatus.UNAUTHORIZED).json({error: error.message});
            } else {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: error.message});
            }
        }

    }
}
