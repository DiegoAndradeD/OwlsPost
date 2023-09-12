import {TypeOrmModule} from '@nestjs/typeorm'
import { Module } from "@nestjs/common";
import { Follower } from '../Entities/follower.entity';
import { FollowerController } from '../Controllers/follower.controller';
import { FollowerService } from '../Services/follower.service';


@Module({
    imports: [TypeOrmModule.forFeature([Follower])],
    controllers: [FollowerController],
    providers: [FollowerService],
    exports: [FollowerService],
})
export class FollowerModule {}