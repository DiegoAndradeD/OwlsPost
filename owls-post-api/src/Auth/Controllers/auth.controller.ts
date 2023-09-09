import { Body, Controller, HttpCode, Post, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { SignInDTO } from '../Dto/signInDto.dto';
import { AuthService } from '../Services/auth.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() signInDto: SignInDTO):Promise<String> {
        const token = await this.authService.signIn(signInDto.username, signInDto.password);
        if (!token) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return token;
    }
}