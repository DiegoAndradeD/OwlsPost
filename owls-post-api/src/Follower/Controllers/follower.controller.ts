import { Controller, Delete, Get, InternalServerErrorException, Param, Post } from "@nestjs/common";
import { FollowerService } from "../Services/follower.service";
import { Follower } from "../Entities/follower.entity";

@Controller('follower')
export class FollowerController {

    constructor(private readonly followerService: FollowerService) {}

    // Get all followers of a user by user ID
    @Get('getUserFollowers/:userid')
    async getAllUserFollowers(@Param('userid') userid: number): Promise<Follower[]> {
        try {
            return this.followerService.getAllUserFollowers(userid);
        } catch (error) {
            throw new InternalServerErrorException('Erro getting followers')
        }
        
    }

    // Get all users that a user is following by user ID
    @Get('getFollowingUsers/:userid')
    async getUserAllFollowing(@Param('userid') userid: number): Promise<Follower[]> {
        try {
            return this.followerService.getUserAllFollowing(userid);
        } catch (error) {
            throw new InternalServerErrorException('Error getting followed users')
        }
        
    }

    // Follow a user by user ID and the user to follow's ID
    @Post('userid/:userid/to_follow_userid/:to_follow_userid')
    async followUser(
        @Param('userid') userid: number,
        @Param('to_follow_userid') to_follow_userid: number
    ): Promise<void> {
        try {
            return this.followerService.followUser(userid, to_follow_userid);
        } catch (error) {
            throw new InternalServerErrorException('Error to follow user')
        }
        
    }

    // Check if a user is following another user by user ID and the user to follow's ID
    @Get('isUserFollowing/userid/:userid/to_follow_userid/:to_follow_userid')
    async checkUserFollowing(
        @Param('userid') userid: number,
        @Param('to_follow_userid') to_follow_userid: number
    ): Promise<number> {
        try {
            return this.followerService.checkUserFollowing(userid, to_follow_userid);
        } catch (error) {
            throw new InternalServerErrorException('Error checking following')
        }
        
    }

    // Unfollow a user by user ID and the user to unfollow's ID
    @Delete('userid/:userid/to_unfollow_userid/:to_follow_userid')
    async unfollowAuthor(
        @Param('userid') userid: number,
        @Param('to_follow_userid') to_follow_userid: number
    ): Promise<void> {
        try {
            return this.followerService.unfollowUser(userid, to_follow_userid);
        } catch (error) {
            throw new InternalServerErrorException('Error unfollowing user')
        }
        
    }
}
