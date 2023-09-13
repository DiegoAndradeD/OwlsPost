import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../Services/user.service";
import { UserDTO } from "../Dto/user.dto";
import { User } from "../Entities/user.entity";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {

    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Post('Signup')
    async registerUser(@Body() userDTO: UserDTO): Promise<User> {
        return this.userService.registerUser(userDTO);
    }

    @Get('/getUserById/:userid')
    async getUserById(@Param('userid') userid: number): Promise<User> {
        return this.userService.getUserById(userid);
    }

}