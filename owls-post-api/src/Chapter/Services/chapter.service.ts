import { Injectable } from "@nestjs/common";
import { Chapter } from "../Entities/chapter.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChapterService {

  
    constructor(@InjectRepository(Chapter) private readonly chapterRepository: Repository<Chapter>) {}

    async getAllChapters(): Promise<Chapter[]> {
        return this.chapterRepository.find();
    }
}
