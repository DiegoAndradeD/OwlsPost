import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../Services/user.service";
import { UserDTO } from "../Dto/user.dto";
import { User } from "../Entities/user.entity";
import { ReturnUserDto } from "../Dto/returnUser.dto";

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

    /**
     * Gets user by id
     * It instatiates a DTO to not return sensitive data as passwords
     * @param userid 
     * @returns a user through a specific dto (ReturnUserDto)
     */
    @Get('/getUserById/:userid')
    async getUserById(@Param('userid') userid: number): Promise<ReturnUserDto> {
      const user: User = await this.userService.getUserById(userid);
      return new ReturnUserDto(user);
    }

    @Post('userid/:userid/changeDescriptionTo')
    async changeDescription(@Body() body: {newDescription: string, userid: string}): Promise<void> {
        return this.userService.changeDescription(body.newDescription, body.userid);
    }
}
