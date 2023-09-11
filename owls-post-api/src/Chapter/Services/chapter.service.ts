import { Injectable } from "@nestjs/common";
import { Chapter } from "../Entities/chapter.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChapterDto } from "../Dto/chapter.dto";

@Injectable()
export class ChapterService {

  
    constructor(@InjectRepository(Chapter) private readonly chapterRepository: Repository<Chapter>) {}

    async getAllChapters(): Promise<Chapter[]> {
        return this.chapterRepository.find();
    }

    async addChapter(chapterDto: ChapterDto):Promise<Chapter> {
        const entityManager = this.chapterRepository.manager;
        const query = `INSERT INTO chapters (title, content, storyid)
        VALUES
        ($1, $2, $3);`;
        return await entityManager.query(query, [chapterDto.title, chapterDto.content, chapterDto.storyid]);
    }

    async getChaptersById(id: number): Promise<Chapter[]> {
        console.log(id)
        const entityManager = this.chapterRepository.manager;
        const query = `
        SELECT * FROM chapters WHERE storyid = $1
        `;
        const result = await entityManager.query(query, [id]);
      
        if (Array.isArray(result) && result.length > 0) {
          return result;
        }
      
        return [];
    }

    async getChapterById(id: number): Promise<Chapter> {
        console.log(id)
        const entityManager = this.chapterRepository.manager;
        const query = `
        SELECT * FROM chapters WHERE id = $1
        `;
        const result = await entityManager.query(query, [id]);
      
        if (Array.isArray(result) && result.length > 0) {
          return result[0];
        }
      
        return null;
    }
      
}
