import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Param, Post, HttpException, NotFoundException, UseGuards, Put } from "@nestjs/common";
import { UserService } from "../Services/user.service";
import { UserDTO } from "../Dto/user.dto";
import { User } from "../Entities/user.entity";
import { ReturnUserDto } from "../Dto/returnUser.dto";
import { AuthMiddleware } from "src/Auth/auth.middleware";

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    /**
     * Gets all users
     * @returns 
     */
    @Get()
    async getAllUsers(): Promise<User[]> {
        try {
            return this.userService.getAllUsers();
        } catch (error) {
            throw new HttpException('Error getting all users', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }

    /**
     * Registers a new user
     * @param userDTO 
     * @returns 
     */
    @Post('Signup')
    async registerUser(@Body() userDTO: UserDTO): Promise<User> {
        try {
            return this.userService.registerUser(userDTO);
        } catch (error) {
            throw new HttpException('Error in user signup', HttpStatus.BAD_REQUEST);
        }
        
    }

    /**
     * Gets user by id
     * It instatiates a DTO to not return sensitive data as passwords
     * @param userid 
     * @returns a user through a specific dto (ReturnUserDto)
     */
    @Get('/getUserById/:userid')
    async getUserById(@Param('userid') userid: number): Promise<ReturnUserDto> {
        try {
            const user: User = await this.userService.getUserById(userid);
            return new ReturnUserDto(user);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            throw new HttpException('Error getting user by id', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      
    }

    /**
     * Function to change a user's description
     * @param body 
     * @returns 
     */
    @Put('userid/:userid/changeDescriptionTo')
    @UseGuards(AuthMiddleware)
    async changeDescription(@Body() body: {newDescription: string, userid: string}): Promise<void> {
        try {
            return this.userService.changeDescription(body.newDescription, body.userid);
        } catch (error) {
            throw new HttpException('Error changing user description', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        
    }
}
