import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/User/Services/user.service';
import { SignInDTO } from '../Dto/signInDto.dto';
import { AuthService } from '../Services/auth.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly userService: UserService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signInDto: SignInDTO, @Res() res: Response): Promise<void> {
        const token = await this.authService.signIn(signInDto.username, signInDto.password);
        if (!token) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const user = await this.userService.findOne(signInDto.username);
        const maxAgeInMilliseconds = 3600000;
        res.cookie('username', user.username, {
            httpOnly: true,
            maxAge: maxAgeInMilliseconds,
        });
        res.cookie('id', user.id, {
            httpOnly: true,
            maxAge: maxAgeInMilliseconds,
        });
        res.json({ access_token: token, username: user.username, id: user.id });
    }

    @Post('check_user')
    async isUserRegistered(@Body() body: { id: string; username: string }, @Res() res: Response, @Req() req: Request):Promise<void> {
        try {
            const { id, username } = body;
            if(!id || !username) {
                throw new UnauthorizedException('Authentication Cookie not Found');
            }
            //TODO - Creact a findOne by username and id function
            const user = await this.userService.findOne(username);
            if(!user) {
                throw new UnauthorizedException('User Not Found');
            }

            res.status(HttpStatus.OK).json({message: 'User Exists'})
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not Authorized' });
          }
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        res.clearCookie('access_token');
        return res.status(200).send('Logout successfull');
    }
    
}