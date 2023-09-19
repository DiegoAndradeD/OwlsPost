import { IsInt, IsString } from "class-validator";


export class StoryDTO {
    @IsString()
    title: string;
    @IsString()
    description: string;
    @IsInt()
    userid: number;

    @IsString()
    username: string;
    
    tags: string[];

}