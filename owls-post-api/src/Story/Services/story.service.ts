import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";
import { AuthService } from "src/Auth/Services/auth.service";
import { UserService } from "src/User/Services/user.service";
import * as jwt from 'jsonwebtoken';
import authConfig from "src/Auth/auth.config";

@Injectable()
export class StoryService {

    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>,
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ){}

    // Register a new story
    // TODO: Add validation to register story
    async registerStory(storyDto: StoryDTO, token: string): Promise<Story> {
        try {
            const user = await this.authService.verifyToken(token);
            if(!user) {
                throw new UnauthorizedException('Invalid Token or not authenticated user')
            }

            return this.storyRepository.save({
                ...storyDto,
            });
        } catch (error) {
            throw new Error("Failed to register the story: " + error.message);
        }
    }

    // Get all stories
    async getAllStories(): Promise<Story[]> {
        try {
            return this.storyRepository.query('SELECT * FROM stories ORDER BY RANDOM()');
        } catch (error) {
            throw new Error("Failed to fetch all stories: " + error.message);
        }
    }

    // Get all stories of a user by user ID
    async getUserStories(userId: number): Promise<Story[]> {
        const entityManager = this.storyRepository.manager;
        const query = `
          SELECT *
          FROM stories
          WHERE userId = $1
        `;
        try {
            const result = await entityManager.query(query, [userId]);
            if (Array.isArray(result) && result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            throw new Error("Failed to fetch user stories: " + error.message);
        }
    }

    // Get a story by user ID and story ID
    async getStoryById(userId: number, id: number): Promise<Story> {
        const entityManager = this.storyRepository.manager;
        const query = `SELECT *
        FROM stories
        WHERE userId = $1 AND stories.id = $2`;
        try {
            const result = await entityManager.query(query, [userId, id]);
            if (result && result.length > 0) {
                return result[0];
            }
            return null;
        } catch (error) {
            throw new Error("Failed to fetch the story by user ID and story ID: " + error.message);
        }
    }

    // Get a story by story ID only
    async getStoryOnlyByStoryId(id: number): Promise<Story> {
        const entityManager = this.storyRepository.manager;
        const query = `SELECT *
        FROM stories
        WHERE stories.id = $1`;
        try {
            const result = await entityManager.query(query, [id]);
            if (result && result.length > 0) {
                return result[0];
            }
            return null;
        } catch (error) {
            throw new Error("Failed to fetch the story by story ID: " + error.message);
        }
    }

    // Delete a story by user ID and story ID
    // TODO: Add error and exception treatment and authentication to delete story
    async deleteStory(userId: number, id: number): Promise<void> {
        const entityManager = this.storyRepository.manager;
        const query = `DELETE
        FROM stories
        WHERE userId = $1 AND stories.id = $2`;
        try {
            await entityManager.query(query, [userId, id]);
        } catch (error) {
            throw new Error("Failed to delete the story: " + error.message);
        }
    }

    // Get stories by title
    async getStoryByTitle(title: string): Promise<Story[]> {
        try {
            return this.storyRepository.find({
                where: {
                    title: ILike(`%${title}%`),
                }
            });
        } catch (error) {
            throw new Error("Failed to fetch stories by title: " + error.message);
        }
    }

    // Get stories by tags
    async getStoriesByTags(tags: string[]): Promise<Story[]> {
        const entityManager = this.storyRepository.manager;

        const query = `
          SELECT DISTINCT stories.*
          FROM stories
          WHERE EXISTS (
            SELECT 1
            FROM UNNEST(tags) AS tag
            WHERE ${tags.map((_, index) => `tag ILIKE '%' || $${index + 1} || '%'`).join(' OR ')}
          )
        `;

        try {
            const stories = await entityManager.query(query, tags);
            return stories;
        } catch (error) {
            throw new Error("Failed to fetch stories by tags: " + error.message);
        }
    }
}
