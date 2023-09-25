import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Chapter } from "../Entities/chapter.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ChapterDto } from "../Dto/chapter.dto";
import { AuthService } from "src/Auth/Services/auth.service";

@Injectable()
export class ChapterService {

    constructor(@InjectRepository(Chapter) private readonly chapterRepository: Repository<Chapter>, private readonly authService: AuthService,) {}

    // Get all chapters
    async getAllChapters(): Promise<Chapter[]> {
        try {
            return await this.chapterRepository.find();
        } catch (error) {
            throw new Error("Failed to fetch chapters");
        }
    }

    // Add a new chapter
    async addChapter(chapterDto: ChapterDto, token: string): Promise<Chapter> {
        try {
            const user = await this.authService.verifyToken(token);
            if(!user) {
                throw new UnauthorizedException('Invalid Token or not authenticated user')
            }

            const entityManager = this.chapterRepository.manager;
            const query = `INSERT INTO chapters (title, content, storyid)
            VALUES
            ($1, $2, $3);`;
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

    async deleteChapter(storyid: number, id: number, token: string): Promise<void> {
        try {
            const user = await this.authService.verifyToken(token)
            if(!user) {
                throw new UnauthorizedException('Invalid Token or not authenticated user')
            }
            try {
                const entityManager = this.chapterRepository.manager;
                const query = `DELETE
                FROM chapters
                WHERE storyid = $1 AND id = $2`;
                await entityManager.query(query, [storyid, id]);
            } catch (error) {
                throw new Error("Failed to delete the chapter: " + error.message);
            }

        } catch (error) {
            throw new Error("Error in proceedment of deleting chapter: " + error.message);
        }
          
    }

    async updateChapter(title: string, content: string, storyid: number, id: number, token: string): Promise<void> {
        try {
            const user = await this.authService.verifyToken(token)
            if(!user) {
                throw new UnauthorizedException('Invalid Token or not authenticated user')
            }
            try {
                const entityManager = this.chapterRepository.manager;
                const query = `UPDATE chapters SET title = $1, content = $2
                WHERE storyid = $3 AND id = $4`;
                await entityManager.query(query, [title, content, storyid, id]);
            } catch (error) {
                throw new Error("Failed to delete the chapter: " + error.message);
            }

        } catch (error) {
            throw new Error("Error in proceedment updating chapter: " + error.message);
        }
          
    }
}
