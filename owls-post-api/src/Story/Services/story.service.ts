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
            SELECT * FROM stories
            WHERE userId = $1
        `;
        return entityManager.query(query, [userId]);
    }
}

