import { IsEmail, IsInt, IsOptional, IsString } from "class-validator";

export class UserDTO {

    @IsString()
    username: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsInt()
    followers_count: number;
    
    @IsString()
    @IsOptional()
    description: string;

    @IsString()
    token: string;
}