import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChapterService } from "../Services/chapter.service";
import { Chapter } from "../Entities/chapter.entity";
import { ChapterDto } from "../Dto/chapter.dto";



@Controller('chapter')
export class ChapterController {

    constructor(private readonly chapterService: ChapterService) {

    }

    @Get()
    async getAllChapters(): Promise<Chapter[]> {
        return this.chapterService.getAllChapters();
    }

    @Post(':id/add-chapter')
    async addChapter(@Body() chapterDto: ChapterDto): Promise<Chapter> {
        return this.chapterService.addChapter(chapterDto);
    }

    @Get('getStory/:id/chapters')
    async getChaptersById(@Param('id') id: number): Promise<Chapter[]> {
        return this.chapterService.getChaptersById(id);
    }

    @Get('getChapter/:id')
    async getChatById(@Param('id') id: number): Promise<Chapter> {
        return this.chapterService.getChapterById(id);
    }
}