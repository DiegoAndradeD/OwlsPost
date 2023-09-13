import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
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

    @Post('userid/:userid/to_follow_userid/:to_follow_userid')
    async followUser(@Param('userid') userid: number,@Param('to_follow_userid') to_follow_userid: number): Promise<void> {
    console.log(userid); 
    console.log(to_follow_userid); 
    return this.followerService.followUser(userid, to_follow_userid);
    }

    @Get('isUserFollowing/userid/:userid/to_follow_userid/:to_follow_userid')
    async checkUserFollowing(@Param('userid') userid: number, @Param('to_follow_userid') to_follow_userid: number): Promise<number> {
        return this.followerService.checkUserFollowing(userid, to_follow_userid);
    }

    @Delete('userid/:userid/to_unfollow_userid/:to_follow_userid')
    async unfollowAuthor(@Param('userid') userid: number, @Param('to_follow_userid') to_follow_userid: number): Promise<void> {
        return this.followerService.unfollowUser(userid, to_follow_userid);
    }
}
