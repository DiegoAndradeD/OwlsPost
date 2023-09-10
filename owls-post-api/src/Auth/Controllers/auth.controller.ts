import { Body, Controller, HttpCode, Post, UnauthorizedException, HttpStatus, Res } from '@nestjs/common';
import { SignInDTO } from '../Dto/signInDto.dto';
import { AuthService } from '../Services/auth.service';
import { UserService } from 'src/User/Services/user.service';
import { Response } from 'express'; 


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
        res.json({ access_token: token, username: user.username });
    }
}