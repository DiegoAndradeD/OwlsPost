import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { Chapter } from "../Entities/chapter.entity";
import { ChapterController } from "../Controllers/chapter.controller";
import { ChapterService } from "../Services/chapter.service";


@Module({
    imports: [TypeOrmModule.forFeature([Chapter])],
    controllers: [ChapterController],
    providers: [ChapterService],
    exports: [ChapterService],
  })
  export class ChapterModule {}