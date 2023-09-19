import { UserModule } from "src/User/Modules/user.module";
import { AuthService } from "../Services/auth.service";
import { Module } from "@nestjs/common";
import { AuthController } from "../Controllers/auth.controller";


@Module({
    imports: [UserModule],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}