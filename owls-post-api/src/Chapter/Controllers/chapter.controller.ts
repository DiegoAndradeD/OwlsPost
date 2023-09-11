import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ChapterService } from "../Services/chapter.service";
import { Chapter } from "../Entities/chapter.entity";



@Controller('chapter')
export class ChapterController {

    constructor(private readonly chapterService: ChapterService) {

    }

    @Get()
    async getAllChapters(): Promise<Chapter[]> {
        return this.chapterService.getAllChapters();
    }

}