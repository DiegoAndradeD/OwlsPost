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
        console.log(userid)
        console.log(storyid)
        const entityManager = this.favoriteRepository.manager;
        const query = `SELECT COUNT(*)
        FROM favorites
        WHERE userid = $1
        AND storyid = $2;`
        const result = await entityManager.query(query, [userid, storyid]);
        console.log(result);
        return result;
    }

    async removeStoryFromFavorites(userid: number, storyid: number): Promise<Favorite> {
        const entityManager = this.favoriteRepository.manager;
        const query = `DELETE FROM FAVORITES WHERE userid = $1 AND storyid = $2;`;
        return await entityManager.query(query, [userid, storyid]);
    }
}