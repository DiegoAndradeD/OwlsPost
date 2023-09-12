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
}