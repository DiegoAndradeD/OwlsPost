import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../Entities/user.entity";
import { Repository } from "typeorm";
import { UserDTO } from "../Dto/user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    // Register a new user
    async registerUser(userDTO: UserDTO): Promise<User> {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(userDTO.password, saltOrRounds);

        return this.userRepository.save({
            ...userDTO,
            password: passwordHashed
        });
    }

    // Get all users
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Find a user by username
    async findOne(username: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { username } });
    }

    // Get a user by user ID
    // TODO: FIX Query to not return user password
    async getUserById(userid: number): Promise<User> {
        const entityManager = this.userRepository.manager;
        const query = `SELECT * FROM users WHERE id = $1;`;
        const result = await entityManager.query(query, [userid]);
        if (result && result.length > 0) {
            return result[0];
        }

        return null;
    }

    async changeUsername(newUsername: string, userid: string): Promise<void> {
        const entityManager = this.userRepository.manager;
        const query = `Update users SET username = $1 WHERE id = $2`;
        return await entityManager.query(query, [newUsername, userid]);
    }

    async changeEmail(newEmail: string, userid: string): Promise<void> {
        const entityManager = this.userRepository.manager;
        const query = `Update users SET email = $1 WHERE id = $2`;
        return await entityManager.query(query, [newEmail, userid]);
    }

    async changePassword(newHashedPassword: string, userid: string): Promise<void> {
        const entityManager = this.userRepository.manager;
        const query = `Update users SET password = $1 WHERE id =$2`;
        return await entityManager.query(query, [newHashedPassword, userid]);
    }
}
