import { IsNumber, IsString } from "class-validator";


export class ChapterDto {

    @IsString()
    title: string;
    @IsString()
    content: string;
    @IsNumber()
    storyid: number;
}