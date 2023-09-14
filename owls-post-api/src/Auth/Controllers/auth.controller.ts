import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/User/Services/user.service';
import { SignInDTO } from '../Dto/signInDto.dto';
import { AuthService } from '../Services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    // Handle user login
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signInDto: SignInDTO, @Res() res: Response): Promise<void> {
        try {
            // Attempt to sign in the user and get a token
            const token = await this.authService.signIn(signInDto.username, signInDto.password);
            if (!token) {
                throw new UnauthorizedException('Invalid credentials');
            }

            // Retrieve user information
            const user = await this.userService.findOne(signInDto.username);

            // Set cookies for user data
            const maxAgeInMilliseconds = 3600000;
            res.cookie('username', user.username, {
                httpOnly: true,
                maxAge: maxAgeInMilliseconds,
            });
            res.cookie('id', user.id, {
                httpOnly: true,
                maxAge: maxAgeInMilliseconds,
            });

            // Respond with token and user data
            res.json({ access_token: token, username: user.username, id: user.id });
        } catch (error) {
            // Handle any errors that occur during login
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not Authorized' });
        }
    }

    // Check if a user is registered
    @Post('check_user')
    async isUserRegistered(@Body() body: { id: string; username: string }, @Res() res: Response, @Req() req: Request): Promise<void> {
        try {
            const { id, username } = body;
            if (!id || !username) {
                throw new UnauthorizedException('Authentication Cookie not Found');
            }

            // TODO: Implement a findOne by username and id function
            const user = await this.userService.findOne(username);
            if (!user) {
                throw new UnauthorizedException('User Not Found');
            }

            // Respond with success message
            res.status(HttpStatus.OK).json({ message: 'User Exists' });
        } catch (error) {
            // Handle any errors that occur during user checking
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not Authorized' });
        }
    }

    // Handle user logout
    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        // Clear the access_token cookie
        res.clearCookie('access_token');
        return res.status(200).send('Logout successful');
    }
}
