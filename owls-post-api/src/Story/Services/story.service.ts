import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Story } from "../Entities/story.entity";
import { StoryDTO } from "../Dto/story.dto";

@Injectable()
export class StoryService {

    constructor(
        @InjectRepository(Story)
        private readonly storyRepository: Repository<Story>
    ){}

    async registerStory(storyDto: StoryDTO):Promise<Story> {
        return this.storyRepository.save({
            ...storyDto,
        });
    }

    async getAllStories(): Promise<Story[]> {
        return this.storyRepository.find();
    }

    async getUserStories(userId: number): Promise<Story[]> {
        const entityManager = this.storyRepository.manager;
        const query = `
          SELECT *
          FROM stories
          WHERE userId = $1
        `;
        const result = await entityManager.query(query, [userId]);
      
        if (Array.isArray(result) && result.length > 0) {
          return result;
        }
      
        return [];
      }

    async getStoryById(userId: number, id: number):Promise<Story> {
        const entityManager = this.storyRepository.manager;
        const query = `SELECT *
        FROM stories
        WHERE userId = $1 AND stories.id = $2`;
        const result = await entityManager.query(query, [userId, id]);
        if(result && result.length > 0) {
            return result[0];
        }
        return null;
    }

    async getStoryOnlyByStoryId(id: number):Promise<Story> {
        const entityManager = this.storyRepository.manager;
        const query = `SELECT *
        FROM stories
        WHERE stories.id = $1`;
        const result = await entityManager.query(query, [id]);
        if(result && result.length > 0) {
            return result[0];
        }
        return null;
    }

    //TODO - Error and exception treatment and authentication to delete story
    async deleteStory(userId: number, id: number):Promise<void> {
        const entityManager = this.storyRepository.manager;
        const query = `DELETE
        FROM stories
        WHERE userId = $1 AND stories.id = $2`;
        return await entityManager.query(query, [userId, id]);
    }

}

