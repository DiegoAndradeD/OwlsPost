import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/User/Services/user.service";
import * as bcrypt from 'bcrypt';
import authConfig from '../auth.config';
import * as jwt from 'jsonwebtoken';
import { ReturnUserDto } from "src/User/Dto/returnUser.dto";

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    // Authenticate user and return a JWT token
    async signIn(username: string, password: string): Promise<any> {
        try {
            // Find user by username
            const user = await this.userService.findOne(username);
            if (!user) {
                return undefined; // User not found
            }

            // Compare the provided password with the hashed password in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid credentials');
            }

            if(!user.token) {
                throw new UnauthorizedException('Token not found');
            }

            return user.token;
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async verifyToken(token: string): Promise<ReturnUserDto | null> {
        try {
            const user = await this.userService.findUserByToken(token);
            if (!user) {
                throw new UnauthorizedException('Invalid Token');
            }

            const decodedToken = jwt.verify(token, authConfig.jwtSecret);
            if (decodedToken) {
                return user;
            } else {
                throw new UnauthorizedException('Token JWT Invalid');
            }
        } catch (error) {
            console.error('Error verifying token', error);
            throw new UnauthorizedException('Invalid Token');
        }
    }


    async checkUserRegistration(id: string, username: string): Promise<boolean> {
        try {
          if (!id || !username) {
            throw new UnauthorizedException('Authentication Cookie not Found');
          }

          const user = await this.userService.findOne(username);
          if (!user) {
            throw new UnauthorizedException('User Not Found');
          }
    
          return true;
        } catch (error) {
          console.log('Not Authorized');
          return false;
        }
      }

    async changeUsername(newUsername: string, userid: string, token: string): Promise<void> {
    try {
        const decodedToken = jwt.verify(token, authConfig.jwtSecret);

        if (!decodedToken) {
        throw new UnauthorizedException('Not Authorized');
        }

        if (!newUsername || typeof newUsername !== 'string') {
        throw new BadRequestException('Invalid new username');
        }

        await this.userService.changeUsername(newUsername, userid);
    } catch (error) {
        console.error('Error processing request:', error);
        throw new UnauthorizedException('Not Authorized');
    }
    }

    async changeEmail(newEmail: string, userid: string, token: string): Promise<void> {
    try {
        const decodedToken = jwt.verify(token, authConfig.jwtSecret);

        if (!decodedToken) {
        throw new UnauthorizedException('Not Authorized');
        }

        if (!newEmail || typeof newEmail !== 'string') {
        throw new BadRequestException('Invalid new email');
        }

        await this.userService.changeEmail(newEmail, userid);
    } catch (error) {
        console.error('Error processing request:', error);
        throw new UnauthorizedException('Not Authorized');
    }
    }

    async changePassword(newPassword: string, userid: string, token: string): Promise<void> {
    try {
        const decodedToken = jwt.verify(token, authConfig.jwtSecret);

        if (!decodedToken) {
        throw new UnauthorizedException('Not Authorized');
        }

        if (!newPassword || typeof newPassword !== 'string') {
        throw new BadRequestException('Invalid new password');
        }

        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(newPassword, saltOrRounds);

        await this.userService.changePassword(passwordHashed, userid);
    } catch (error) {
        console.error('Error processing request:', error);
        throw new UnauthorizedException('Not Authorized');
    }
    }

    

}
