import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/User/Services/user.service";
import * as bcrypt from 'bcrypt';
import authConfig from '../auth.config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
    constructor(private userService: UserService){}

    async signIn(username: string, password: string): Promise<any> {
        const user = await this.userService.findOne(username);
        if(!user) {
            return undefined;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            throw new UnauthorizedException();
        }

        const token = await this.generateJwtToken(user);
        return token;
    }

    async generateJwtToken(user: any): Promise<string> {
        const payload = { username: user.username, sub: user.id };
        return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: '1h' });
      }
}