
import {TypeOrmModule} from '@nestjs/typeorm'
import { Module } from "@nestjs/common";
import { Story } from '../Entities/story.entity';
import { StoryController } from '../Controllers/story.controller';
import { StoryService } from '../Services/story.service';

@Module({
    imports: [TypeOrmModule.forFeature([Story])],
    controllers: [StoryController],
    providers: [StoryService],
    exports: [StoryService],
})
export class StoryModule {}