import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Follower } from "../Entities/follower.entity";

@Injectable()
export class FollowerService {

    constructor(@InjectRepository(Follower) private readonly followerRepository: Repository<Follower>) {}

    /**
     * Get all followers of a user by its ID
     * @param userid 
     * @returns an array of user followers
     */ 
    async getAllUserFollowers(userid: number): Promise<Follower[]> {
        try {
            const entityManager = this.followerRepository.manager;
            const query = `
                SELECT u.username AS follower_username
                FROM followers f
                INNER JOIN users u ON f.followerid = u.id
                WHERE f.followingid = $1;`;

            const result = await entityManager.query(query, [userid]);

            if (Array.isArray(result) && result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            throw new InternalServerErrorException('Error getting user followers');
        }
        
    }

    /**
     * Get all users that a user is following by user ID
     * @param userid 
     * @returns an array of followed users
     */
    async getUserAllFollowing(userid: number): Promise<Follower[]> {
        try {
            const entityManager = this.followerRepository.manager;
            const query = `
            SELECT u.username AS following_username, u.id as userid
            FROM followers f
            INNER JOIN users u ON f.followingid = u.id
            WHERE f.followerid = $1`;
            const result = await entityManager.query(query, [userid]);
            if (Array.isArray(result) && result.length > 0) {
                return result;
            }
            return [];
        } catch (error) {
            throw new InternalServerErrorException('Error getting followed users');
        }
        
    }

    /**
     * Function to follow a user by user ID and the user to follow's ID
     * @param userid 
     * @param to_follow_userid 
     */
    async followUser(userid: number, to_follow_userid: number): Promise<void> {
        const isUserFollowing = await this.checkUserFollowing( userid, to_follow_userid);
        if (isUserFollowing === 0) {
            const entityManager = this.followerRepository.manager;
            const query = `
                INSERT INTO followers 
                (followerid, followingid, created_at) 
                VALUES ($1, $2, NOW())
            `;

            try {
                await entityManager.query(query, [userid, to_follow_userid]);
            } catch (error) {
                throw new Error("Error following the user: " + error.message);
            }

            try {
                await this.updateUserFollowers(to_follow_userid, userid);
            } catch (error) {
                throw new Error("Error updating user's followers: " + error.message);
            }
        } else {
            throw new Error("You Already Follow this user.");
        }
    }

    /**
     * // Check if a user is following another user by user ID and the user to follow's ID
     * @param userid 
     * @param to_follow_userid 
     * @returns 1 if the user is following, 0 if not
     */
    async checkUserFollowing(userid: number, to_follow_userid: number): Promise<number> {
        if(!(userid === to_follow_userid)) {
            try {
                const entityManager = this.followerRepository.manager;
                const query = `
                    SELECT COUNT(*)
                    FROM followers
                    WHERE followerid = $1
                    AND followingid = $2
                `;
                const result = await entityManager.query(query, [userid, to_follow_userid]);
                return parseInt(result[0].count, 10);
            } catch (error) {
                throw new InternalServerErrorException('Error checking user to follow')
            }
        }
        throw new UnauthorizedException('User cannot follow self');
       
    }

    /**
     * Update user's followers count
     * @param to_follow_userid 
     * @param userid 
     */
    async updateUserFollowers(to_follow_userid: number, userid: number): Promise<void> {
        try {
            const entityManager = this.followerRepository.manager;
            const query = `
                UPDATE users u
                SET followers_count = (
                    SELECT COUNT(*)
                    FROM followers f
                    WHERE f.followingid = u.id
                )
                WHERE u.id = $1;`;
            await entityManager.query(query, [to_follow_userid]);
        } catch (error) {
            console.error('Error updating user followers:', error);
            throw error;
        }

        try {
            const entityManager = this.followerRepository.manager;
            const query = `
                UPDATE users u
                SET followers_count = (
                    SELECT COUNT(*)
                    FROM followers f
                    WHERE f.followingid = u.id
                )
                WHERE u.id = $1;`;
            await entityManager.query(query, [userid]);
        } catch (error) {
            console.error('Error updating user followers:', error);
            throw error;
        }
    }

    /**
     * Unfollow a user by user ID and the user to unfollow's ID
     * @param userid 
     * @param to_follow_userid 
     */
    async unfollowUser(userid: number, to_follow_userid: number): Promise<void> {
        const entityManager = this.followerRepository.manager;
        const query = `
            DELETE FROM followers 
            WHERE followers.followerid = $1 
            AND followers.followingid = $2;`;
        try {
            await entityManager.query(query, [userid, to_follow_userid]);
        } catch (error) {
            throw new Error("Error unfollowing the user: " + error.message);
        }

        try {
            await this.updateUserFollowers(to_follow_userid, userid);
        } catch (error) {
            throw new Error("Error updating user's followers: " + error.message);
        }
    }
}
