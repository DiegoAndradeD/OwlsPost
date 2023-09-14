import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChapterService } from "../Services/chapter.service";
import { Chapter } from "../Entities/chapter.entity";
import { ChapterDto } from "../Dto/chapter.dto";

@Controller('chapter')
export class ChapterController {

    constructor(private readonly chapterService: ChapterService) {}

    // Get all chapters
    @Get()
    async getAllChapters(): Promise<Chapter[]> {
        return this.chapterService.getAllChapters();
    }

    // Add a new chapter to a story by ID
    @Post(':id/add-chapter')
    async addChapter(@Body() chapterDto: ChapterDto): Promise<Chapter> {
        return this.chapterService.addChapter(chapterDto);
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
}
