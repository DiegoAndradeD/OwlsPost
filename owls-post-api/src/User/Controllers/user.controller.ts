import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../Services/user.service";
import { UserDTO } from "../Dto/user.dto";
import { User } from "../Entities/user.entity";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    // Get all users
    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    // Register a new user
    @Post('Signup')
    async registerUser(@Body() userDTO: UserDTO): Promise<User> {
        return this.userService.registerUser(userDTO);
    }

    // Get a user by user ID
    @Get('/getUserById/:userid')
    async getUserById(@Param('userid') userid: number): Promise<User> {
        return this.userService.getUserById(userid);
    }
}
