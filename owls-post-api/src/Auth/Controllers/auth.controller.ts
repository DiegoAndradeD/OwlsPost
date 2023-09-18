import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/User/Services/user.service';
import { SignInDTO } from '../Dto/signInDto.dto';
import { AuthService } from '../Services/auth.service';
import authConfig from '../auth.config';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    /**
     * Function to login the user
     * checks the token with a function from authService
     * Creates the user cookie
     * @param signInDto 
     * @param res 
     */
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

    /**
     * Checks if the user is registered with an authService function
     * @param body 
     * @param res 
     * @param req 
     */
    @Post('check_user')
    async isUserRegistered(@Body() body: { id: string; username: string }, @Res() res: Response, @Req() req: Request): Promise<void> {
      try {
        const { id, username } = body;
        const isRegistered = await this.authService.checkUserRegistration(id, username);
  
        if (isRegistered) {
          res.status(HttpStatus.OK).json({ message: 'User Exists' });
        } else {
          res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Not Authorized' });
        }
      } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
      }
    }

    // Handle user logout
    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response) {
        // Clear the access_token cookie
        res.clearCookie('access_token');
        res.clearCookie('username');
        res.clearCookie('id');
        return res.status(200).send('Logout successful');
    }

    @Post('change-username')
    async changeUsername(
      @Body() body: { newUsername: string; userid: string },
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<void> {
      try {
        const authHeader = req.headers.authorization;
  
        if (!authHeader) {
          console.log('Missing authorization header');
          throw new UnauthorizedException('Missing authorization header');
        }
  
        const parts = authHeader.split(' ');
  
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          console.log('Invalid authorization header format');
          throw new UnauthorizedException('Invalid authorization header format');
        }
  
        const token = parts[1];
  
        await this.authService.changeUsername(body.newUsername, body.userid, token);
  
        res.status(HttpStatus.OK).json({ message: 'Username changed successfully' });
      } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
      }
    }
  
    @Post('change-email')
    async changeEmail(
      @Body() body: { newEmail: string; userid: string },
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<void> {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          throw new UnauthorizedException('Missing authorization header');
        }
  
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          throw new UnauthorizedException('Invalid authorization header format');
        }
  
        const token = parts[1];
  
        await this.authService.changeEmail(body.newEmail, body.userid, token);
  
        res.status(HttpStatus.OK).json({ message: 'Email changed successfully' });
      } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
      }
    }
  
    @Post('change-password')
    async changePassword(
      @Body() body: { newPassword: string; userid: string },
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<void> {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
          throw new UnauthorizedException('Missing authorization header');
        }
  
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
          throw new UnauthorizedException('Invalid authorization header format');
        }
  
        const token = parts[1];
  
        await this.authService.changePassword(body.newPassword, body.userid, token);
  
        res.status(HttpStatus.OK).json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error(error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
      }
    }


    
}
