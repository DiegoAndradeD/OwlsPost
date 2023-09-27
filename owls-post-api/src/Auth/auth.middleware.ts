import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import authConfig from "./auth.config";
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: (error?: NextFunction) => void) {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if(!token) {
            return res.status(401).json({message: 'JWT Token missing'});
        }

        try {
            const decodedToken = jwt.verify(token, authConfig.jwtSecret);
            if (decodedToken) {
                next();
            } else {
                throw new UnauthorizedException('Token JWT Invalid');
            }
            
        } catch (error) {
            throw new UnauthorizedException('JWT Token Invalid');
        }
       
    }

}