import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorite } from "../Entity/favorite.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FavoriteService {

    constructor(@InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>) {}

    async getAllFavorites(): Promise<Favorite[]> {
        return this.favoriteRepository.find();
    }
    
    async addStoryToFavorites(userid: number, storyid: number): Promise<Favorite> {
        const entityManager = this.favoriteRepository.manager;
        const query = `INSERT INTO favorites (userid, storyid) VALUES ($1, $2)`;
        return await entityManager.query(query, [userid, storyid]);
    }

    async isStoryFavorite(userid: number, storyid: number): Promise<number> {
        const entityManager = this.favoriteRepository.manager;
        const query = `SELECT COUNT(*)
        FROM favorites
        WHERE userid = $1
        AND storyid = $2;`
        const result = await entityManager.query(query, [userid, storyid]);
        return result;
    }

    async removeStoryFromFavorites(userid: number, storyid: number): Promise<Favorite> {
        const entityManager = this.favoriteRepository.manager;
        const query = `DELETE FROM FAVORITES WHERE userid = $1 AND storyid = $2;`;
        return await entityManager.query(query, [userid, storyid]);
    }

    async getUserFavoriteStories(userid: number): Promise<Favorite[]> {
        const entityManager = this.favoriteRepository.manager;
        const query = `SELECT s.title AS story_title, s.id as storyid, s.description as story_description, s.userid as author_id
        from favorites f
        INNER JOIN stories s ON f.storyid = s.id
        WHERE f.userid = $1`;
        const result = await entityManager.query(query, [userid]);
        if(Array.isArray(result) && result.length > 0) {
            return result;
        }

        return [];
    }
}