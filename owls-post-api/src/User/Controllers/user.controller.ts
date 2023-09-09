import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserService } from "../Services/user.service";
import { UserDTO } from "../Dto/user.dto";
import { User } from "../Entities/user.entity";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {

    }

    @Post('Signup')
    async registerUser(@Body() userDTO: UserDTO): Promise<User> {
        return this.userService.registerUser(userDTO);
    }

}