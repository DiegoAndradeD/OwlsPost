import { Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { FollowerService } from "../Services/follower.service";
import { Follower } from "../Entities/follower.entity";

@Controller('follower')
export class FollowerController {

    constructor(private readonly followerService: FollowerService) {}

    // Get all followers of a user by user ID
    @Get('getUserFollowers/:userid')
    async getAllUserFollowers(@Param('userid') userid: number): Promise<Follower[]> {
        console.log('here')
        console.log(userid);
        return this.followerService.getAllUserFollowers(userid);
    }

    // Get all users that a user is following by user ID
    @Get('getFollowingUsers/:userid')
    async getUserAllFollowing(@Param('userid') userid: number): Promise<Follower[]> {
        return this.followerService.getUserAllFollowing(userid);
    }

    // Follow a user by user ID and the user to follow's ID
    @Post('userid/:userid/to_follow_userid/:to_follow_userid')
    async followUser(
        @Param('userid') userid: number,
        @Param('to_follow_userid') to_follow_userid: number
    ): Promise<void> {
        return this.followerService.followUser(userid, to_follow_userid);
    }

    // Check if a user is following another user by user ID and the user to follow's ID
    @Get('isUserFollowing/userid/:userid/to_follow_userid/:to_follow_userid')
    async checkUserFollowing(
        @Param('userid') userid: number,
        @Param('to_follow_userid') to_follow_userid: number
    ): Promise<number> {
        return this.followerService.checkUserFollowing(userid, to_follow_userid);
    }

    // Unfollow a user by user ID and the user to unfollow's ID
    @Delete('userid/:userid/to_unfollow_userid/:to_follow_userid')
    async unfollowAuthor(
        @Param('userid') userid: number,
        @Param('to_follow_userid') to_follow_userid: number
    ): Promise<void> {
        return this.followerService.unfollowUser(userid, to_follow_userid);
    }
}
