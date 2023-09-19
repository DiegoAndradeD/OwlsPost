import { IsInt } from "class-validator";

export class FavoriteDto {
    @IsInt()
    userid: number;
    @IsInt()
    storyid: number;
}