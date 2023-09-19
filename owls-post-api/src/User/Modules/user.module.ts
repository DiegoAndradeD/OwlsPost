import { UserController } from "../Controllers/user.controller";
import { User } from "../Entities/user.entity";
import {TypeOrmModule} from '@nestjs/typeorm'
import { UserService } from "../Services/user.service";
import { Module } from "@nestjs/common";
import { AuthModule } from "src/Auth/Modules/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}