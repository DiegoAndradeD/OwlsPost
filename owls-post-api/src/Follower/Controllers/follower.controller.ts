import { Controller, Get, Param } from "@nestjs/common";
import { FollowerService } from "../Services/follower.service"; 
import { Follower } from "../Entities/follower.entity";

@Controller('follower')
export class FollowerController {

    constructor(private readonly followerService: FollowerService) {} 

    @Get('getUserFollowers/:userid')
    async getAllUserFollowers(@Param('userid') userid: number): Promise<Follower[]> {
        console.log('here')
        console.log(userid);
        return this.followerService.getAllUserFollowers(userid);
    }

    @Get('getFollowingUsers/:userid')
    async getUserAllFollowing(@Param('userid') userid: number): Promise<Follower[]> {
        console.log('here')
        console.log(userid);
        return this.followerService.getUserAllFollowing(userid);
    }
}
