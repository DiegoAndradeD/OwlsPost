import { Controller, Get, Param, Post } from "@nestjs/common";
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
        return this.followerService.getUserAllFollowing(userid);
    }

    @Post('user/:userid/followUser/:followingid')
    async followUser(@Param('userid') userid: number, @Param('followingid') followingid: number): Promise<void> {
        return this.followerService.followUser(userid, followingid);
    }
}
