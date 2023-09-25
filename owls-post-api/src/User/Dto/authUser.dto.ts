import { User } from "src/User/Entities/user.entity";


export class authUserDto {
    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.token = user.token;
    }

    id: Number;
    username: string;
    email: string;
    token: string;
}