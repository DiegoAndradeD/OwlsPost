import { IsString } from "class-validator";

export class UserDTO {
    @IsString()
    username: string;

    @IsString()
    email: string;

    @IsString()
    password: string;

    followers_count: number;
    
    @IsString()
    description: string;
}