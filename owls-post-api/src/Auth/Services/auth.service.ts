import { Injectable, UnauthorizedException } from "@nestjs/common";
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
}
