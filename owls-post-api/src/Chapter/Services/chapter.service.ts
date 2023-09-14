import { Injectable, NotFoundException } from "@nestjs/common";
import { Chapter } from "../Entities/chapter.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChapterDto } from "../Dto/chapter.dto";

@Injectable()
export class ChapterService {

    constructor(@InjectRepository(Chapter) private readonly chapterRepository: Repository<Chapter>) {}

    // Get all chapters
    async getAllChapters(): Promise<Chapter[]> {
        try {
            return await this.chapterRepository.find();
        } catch (error) {
            throw new Error("Failed to fetch chapters");
        }
    }

    // Add a new chapter
    async addChapter(chapterDto: ChapterDto): Promise<Chapter> {
        const entityManager = this.chapterRepository.manager;
        const query = `INSERT INTO chapters (title, content, storyid)
        VALUES
        ($1, $2, $3);`;
        try {
            return await entityManager.query(query, [chapterDto.title, chapterDto.content, chapterDto.storyid]);
        } catch (error) {
            throw new Error("Failed to add chapter");
        }
    }

    // Get all chapters of a story by its ID
    async getChaptersById(id: number): Promise<Chapter[]> {
        const entityManager = this.chapterRepository.manager;
        const query = `
        SELECT * FROM chapters WHERE storyid = $1
        `;
        try {
            const result = await entityManager.query(query, [id]);
            if (Array.isArray(result) && result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            throw new Error("Failed to fetch chapters by story ID");
        }
    }

    // Get a specific chapter by its ID
    async getChapterById(id: number): Promise<Chapter | null> {
        const entityManager = this.chapterRepository.manager;
        const query = `
        SELECT * FROM chapters WHERE id = $1
        `;
        try {
            const result = await entityManager.query(query, [id]);
            if (Array.isArray(result) && result.length > 0) {
                return result[0];
            }
            return null;
        } catch (error) {
            throw new NotFoundException(`Chapter with ID ${id} not found`);
        }
    }
}
