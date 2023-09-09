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
}