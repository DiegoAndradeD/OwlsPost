import { IsInt } from "class-validator";

export class FollowerDto {
    @IsInt()
    follower: number;
    @IsInt()
    following: number;
}