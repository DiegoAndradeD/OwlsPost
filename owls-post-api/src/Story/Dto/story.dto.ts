import { IsString } from "class-validator";


export class StoryDTO {
    @IsString()
    title: string;
    @IsString()
    description: string;

    userid: number;

    @IsString()
    username: string;
    
    tags: string[];

}