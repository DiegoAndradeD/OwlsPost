import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";
import { AuthService } from "../../Auth/Services/auth.service";
import { UserService } from "../../User/Services/user.service";
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

    /**
     *  Function to register a new story to a logged in user
     * It will only register the story if the token is validated
     * @param storyDto 
     * @param token 
     * @returns 
     */
    async registerStory(storyDto: StoryDTO): Promise<Story> {
        try {
            return this.storyRepository.save({
                ...storyDto,
            });
        } catch (error) {
            throw new Error("Failed to register the story: " + error.message);
        }
    }

    /**
     * Gets all the stories for the Index page
     * @returns All Stories
     */
    async getAllStories(): Promise<Story[]> {
        try {
            return this.storyRepository.query('SELECT * FROM stories ORDER BY RANDOM()');
        } catch (error) {
            throw new Error("Failed to fetch all stories: " + error.message);
        }
    }

    /**
     * Gets all the stories from a user
     * @param userId 
     * @returns ALL stories from a user
     */
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

    /**
     * Gets a determined story by its id and user id
     * @param userId 
     * @param id 
     * @returns A story
     */
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

    /**
     * Gets a determined story by its
     * @param id 
     * @returns Story
     */
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

   /**
    * Delete a story after passing user validation
    * @param userId 
    * @param id 
    * @param token 
    */
    async deleteStory(userId: number, id: number): Promise<void> {
        try {
            const entityManager = this.storyRepository.manager;
            const query = `DELETE
            FROM stories
            WHERE userId = $1 AND stories.id = $2`;
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
