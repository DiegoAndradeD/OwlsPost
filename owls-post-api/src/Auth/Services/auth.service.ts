import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/User/Services/user.service";
import * as bcrypt from 'bcrypt';
import authConfig from '../auth.config';
import * as jwt from 'jsonwebtoken';

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

            // Generate and return a JWT token
            const token = await this.generateJwtToken(user);
            return token;
        } catch (error) {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    // Generate a JWT token for the authenticated user
    async generateJwtToken(user: any): Promise<string> {
        try {
            // Create the JWT payload with username and user ID
            const payload = { username: user.username, sub: user.id };
            
            // Sign the payload with the JWT secret and set an expiration time
            return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
        } catch (error) {
            // Handle any errors that occur during token generation
            throw new UnauthorizedException('Token generation failed');
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
