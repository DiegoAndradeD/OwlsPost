import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Follower } from "../Entities/follower.entity";

@Injectable()
export class FollowerService {

    constructor(@InjectRepository(Follower) private readonly followerRepository: Repository<Follower>) {}

    // Get all followers of a user by user ID
    async getAllUserFollowers(userid: number): Promise<Follower[]> {
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
    }

    // Get all users that a user is following by user ID
    async getUserAllFollowing(userid: number): Promise<Follower[]> {
        const entityManager = this.followerRepository.manager;
        const query = `
            SELECT u.username AS following_username
            FROM followers f
            INNER JOIN users u ON f.followingid = u.id
            WHERE f.followerid = $1`;
        const result = await entityManager.query(query, [userid]);
        if (Array.isArray(result) && result.length > 0) {
            return result;
        }
        return [];
    }

    // Follow a user by user ID and the user to follow's ID
    async followUser(userid: number, to_follow_userid: number): Promise<void> {
        const isUserFollowing = await this.checkUserFollowing(to_follow_userid, userid);
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
                await this.updateUserFollowers(to_follow_userid);
            } catch (error) {
                throw new Error("Error updating user's followers: " + error.message);
            }
        } else {
            throw new Error("You Already Follow this user.");
        }
    }

    // Check if a user is following another user by user ID and the user to follow's ID
    async checkUserFollowing(userid: number, to_follow_userid: number): Promise<number> {
        const entityManager = this.followerRepository.manager;
        const query = `
            SELECT COUNT(*)
            FROM followers
            WHERE followerid = $1
            AND followingid = $2
        `;
        const result = await entityManager.query(query, [userid, to_follow_userid]);
        return parseInt(result[0].count, 10);
    }

    // Update user's followers count
    async updateUserFollowers(to_follow_userid: number): Promise<void> {
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
    }

    // Unfollow a user by user ID and the user to unfollow's ID
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
            await this.updateUserFollowers(to_follow_userid);
        } catch (error) {
            throw new Error("Error updating user's followers: " + error.message);
        }
    }
}
