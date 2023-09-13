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

    async registerUser(userDTO: UserDTO):Promise<User> {
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(userDTO.password, saltOrRounds);

        return this.userRepository.save({
            ...userDTO,
            password: passwordHashed
        });
    }

    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(username: string):Promise<User | undefined> {
        return this.userRepository.findOne({where: {username}});
    }

    async getUserById(userid: number): Promise<User> {
        const entityManager = this.userRepository.manager;
        const query = `SELECT * FROM users WHERE id = $1;`;
        const result = await entityManager.query(query, [userid]);
        if(result && result.length > 0) {
            return result[0];
        }

        return null;
    }
}