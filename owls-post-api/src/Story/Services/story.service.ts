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
        console.log(storyDto)
        return this.storyRepository.save({
            ...storyDto,
        });
    }

    async getAllStories(): Promise<Story[]> {
        return this.storyRepository.find();
    }

}