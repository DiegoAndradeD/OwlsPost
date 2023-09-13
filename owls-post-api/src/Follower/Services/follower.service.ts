import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Follower } from "../Entities/follower.entity";

@Injectable()
export class FollowerService {

    constructor(@InjectRepository(Follower) private readonly followerRepository: Repository<Follower>){}

    async getAllUserFollowers(userid: number): Promise<Follower[]> {
        const entityManager = this.followerRepository.manager; 
        const query = `SELECT u.username AS follower_username
        FROM followers f
        INNER JOIN users u ON f.followerid = u.id
        WHERE f.followingid = $1;`
        const result = await entityManager.query(query, [userid]);
        if(Array.isArray(result) && result.length > 0) {
            return result;
        }

        return [];
    }

    async getUserAllFollowing(userid: number): Promise<Follower[]> {
        const entityManager = this.followerRepository.manager;
        const query = `
            SELECT u.username AS following_username
            FROM followers f
            INNER JOIN users u ON f.followingid = u.id
            WHERE f.followerid = $1`;
        const result = await entityManager.query(query, [userid]);
        if(Array.isArray(result) && result.length > 0) {
            return result;
        }

        return [];
    }

    //TODO - ADD validation to login if user is not logged to follow
    async followUser(userid: number, followingid: number): Promise<void> {
        const isUserFollowing = await this.checkUserFollowing(userid, followingid);
        if (isUserFollowing === 0) {
            const entityManager = this.followerRepository.manager;
            const query = `
            INSERT INTO followers 
            (followerid, followingid, created_at) 
            VALUES ($1, $2, NOW())
            `;
    
            try {
                await entityManager.query(query, [followingid, userid]);
            } catch (error) {
                throw new Error("Error following the user: " + error.message);
            }
            try {
                await this.updateUserFollowers(userid);
            } catch (error) {
                throw new Error("Error updating user's followers: " + error.message);
            }

         
        } else {
            throw new Error("You Already Follow this user.");
        }
    }
    
    

    async checkUserFollowing(userid: number, followingid: number): Promise<number> {
        const entityManager = this.followerRepository.manager;
        const query = `
          SELECT COUNT(*)
          FROM followers
          WHERE followerid = $1
          AND followingid = $2
        `;
        const result = await entityManager.query(query, [followingid, userid]);
        return parseInt(result[0].count, 10); 
      }

      async updateUserFollowers(userid: number): Promise<void> {
        try {
            const entityManager = this.followerRepository.manager;
            const query = `UPDATE users u
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
    
         
}