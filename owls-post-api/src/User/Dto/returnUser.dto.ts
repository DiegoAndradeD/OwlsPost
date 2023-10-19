/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Follower } from "src/Follower/Entities/follower.entity";
import { User } from "../Entities/user.entity";

export class ReturnUserDto {
    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.created_at = user.created_at;
        this.followers_count = user.followers_count;
        this.description = user.description;
    }

    id: Number;
    username: string;
    email: string;
    created_at: Date;
    followers_count: number;
    description: string;
}