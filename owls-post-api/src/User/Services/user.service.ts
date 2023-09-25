import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../Entities/user.entity";
import { Repository } from "typeorm";
import { UserDTO } from "../Dto/user.dto";
import * as bcrypt from 'bcrypt';
import authConfig from "src/Auth/auth.config";
import * as jwt from 'jsonwebtoken';
import { AuthService } from "src/Auth/Services/auth.service";
import { ReturnUserDto } from "../Dto/returnUser.dto";
import { authUserDto } from "../Dto/authUser.dto";

@Injectable()
export class UserService {

    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    /**
     * Register a new user with it's dto
     * Encrypts the password with hash
     * @param userDTO 
     * @returns 
     */
    async registerUser(userDTO: UserDTO): Promise<User> {
        try {
            const saltOrRounds = 10;
            const passwordHashed = await bcrypt.hash(userDTO.password, saltOrRounds);
            
            const tokenPayload = {
                userid: userDTO.username,
                email: userDTO.email,
            }
            const token = jwt.sign(tokenPayload, authConfig.jwtSecret); 

            return this.userRepository.save({
                ...userDTO,
                password: passwordHashed,
                token: token,
            });
        } catch (error) {
            if (error.code == '23505') {
                throw new ConflictException('Username or email already in use')
            }
            throw new InternalServerErrorException('Error registering user.')
        }
        
    }

    /**
     * Gets all users
     * @returns All users
     */
    async getAllUsers(): Promise<User[]> {
        try {
            return this.userRepository.find();
        } catch (error) {
            throw new InternalServerErrorException('Error getting users.')
        }
        
    }

    /**
     * Finds a user by username
     * @param username 
     * @returns User
     */
    async findOne(username: string): Promise<User | undefined> {
        try {
            return this.userRepository.findOne({ where: { username } });
        } catch (error) {
            throw new InternalServerErrorException('Error getting user by username')
        }
    }

    /**
     * Gets a user by it's id
     * @param userid 
     * @returns user
     */
    async getUserById(userid: number): Promise<User> {
        try {
            const entityManager = this.userRepository.manager;
            const query = `SELECT * FROM users WHERE id = $1;`;
            const result = await entityManager.query(query, [userid]);
            if (result && result.length > 0) {
                return result[0];
            }

            throw new NotFoundException(`UserId ${userid} not found`)
        } catch (error) {
            throw new InternalServerErrorException('Error getting user by id')
        }
        
    }

    /**
     * Changes the username to a new one
     * @param newUsername 
     * @param userid 
     * @returns 
     */
    async changeUsername(newUsername: string, userid: string): Promise<void> {
        try {
            const entityManager = this.userRepository.manager;
            const query = `Update users SET username = $1 WHERE id = $2`;
            return await entityManager.query(query, [newUsername, userid]);
        } catch (error) {
            throw new InternalServerErrorException('Error updating username')
        }
        
    }

    /**
     * Changes the user email to a new one
     * @param newEmail 
     * @param userid 
     * @returns 
     */
    async changeEmail(newEmail: string, userid: string): Promise<void> {
        try {
            const entityManager = this.userRepository.manager;
            const query = `Update users SET email = $1 WHERE id = $2`;
            return await entityManager.query(query, [newEmail, userid]);
        } catch (error) {
            throw new InternalServerErrorException('Error updation email')
        }
        
    }

    /**
     * Changes the user password to a new, hashed one.
     * @param newHashedPassword 
     * @param userid 
     * @returns 
     */
    async changePassword(newHashedPassword: string, userid: string): Promise<void> {
        try {
            const entityManager = this.userRepository.manager;
            const query = `Update users SET password = $1 WHERE id =$2`;
            return await entityManager.query(query, [newHashedPassword, userid]);
        } catch (error) {
            throw new InternalServerErrorException('Error updation password')
        }
        
    }

    /**
     * Function to find a user from the database based in its token
     * @param token 
     * @returns user
     */
    async findUserByToken(token: string): Promise<authUserDto | null> {
        try {
            const user = await this.userRepository.findOne({ where: {token} });
            return user ? new authUserDto(user) : null;
        } catch (error) {
            console.error('Error search user by token:', error);
            throw new NotFoundException('User not found');
        }
    }

    /**
     * Function to change a user description for a new one
     * @param newDescription 
     * @param userid 
     * @returns 
     */
    async changeDescription(newDescription: string, userid: string):Promise<void> {
        try {
            const entityManager = this.userRepository.manager;
            const query = `UPDATE users SET description = $1 WHERE id = $2`;
            return await entityManager.query(query, [newDescription, userid]);
        } catch (error) {
            throw new InternalServerErrorException('Error updation description')
        }
        
    }

}
