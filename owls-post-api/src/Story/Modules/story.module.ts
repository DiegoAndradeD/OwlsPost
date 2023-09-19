
import {TypeOrmModule} from '@nestjs/typeorm'
import { Module } from "@nestjs/common";
import { Story } from '../Entities/story.entity';
import { StoryController } from '../Controllers/story.controller';
import { StoryService } from '../Services/story.service';
import { AuthService } from 'src/Auth/Services/auth.service';
import { UserService } from 'src/User/Services/user.service';
import { AuthModule } from 'src/Auth/Modules/auth.module';
import { UserModule } from 'src/User/Modules/user.module';

@Module({
    imports: [TypeOrmModule.forFeature([Story]), AuthModule, UserModule],
    controllers: [StoryController],
    providers: [StoryService],
    exports: [StoryService],
})
export class StoryModule {}