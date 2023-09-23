import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Favorite } from "../Entity/favorite.entity";
import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

@Injectable()
export class FavoriteService {

    constructor(@InjectRepository(Favorite) private readonly favoriteRepository: Repository<Favorite>) {}

    /**
     * Gets all favorites
     * @returns 
     */
    async getAllFavorites(): Promise<Favorite[]> {
        return this.favoriteRepository.find();
    }
    
    /**
     * Adds a story to the user favorites
     * A user must not be the author of the story to make it a favorite
     * @param userid 
     * @param storyid 
     * @returns 
     */
    async addStoryToFavorites(userid: number, storyid: number): Promise<Favorite> {
        const isUserTheStoryOwner = await this.checkIfUserIsAuthor(userid, storyid);
        if(isUserTheStoryOwner === 0) {
            try {
                const entityManager = this.favoriteRepository.manager;
                const query = `INSERT INTO favorites (userid, storyid) VALUES ($1, $2)`;
                return await entityManager.query(query, [userid, storyid]);
            } catch (error) {
                throw new InternalServerErrorException('Failed to add story to favorites')
            }
        } else {
            throw new NotFoundException('User cannot add their own story to favorites')
        }
        
    }

    /**
     * Checks if the story is in the user favorites
     * @param userid 
     * @param storyid 
     * @returns 
     */
    async isStoryFavorite(userid: number, storyid: number): Promise<number> {
        try {
            const entityManager = this.favoriteRepository.manager;
            const query = `SELECT COUNT(*)
            FROM favorites
            WHERE userid = $1
            AND storyid = $2;`
            const result = await entityManager.query(query, [userid, storyid]);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Error checking if the story is in the user favorites')
        }
        
    }

    /**
     * Removes a story from the user favorites
     * A user must not be the story author to remove it from its favorites
     * @param userid 
     * @param storyid 
     * @returns 
     */
    async removeStoryFromFavorites(userid: number, storyid: number): Promise<Favorite> {
        const isUserTheStoryOwner = await this.checkIfUserIsAuthor(userid, storyid);
        if(isUserTheStoryOwner === 0) {
        try {
            const entityManager = this.favoriteRepository.manager;
            const query = `DELETE FROM FAVORITES WHERE userid = $1 AND storyid = $2;`;
            return await entityManager.query(query, [userid, storyid]);
        } catch (error) {
            throw new InternalServerErrorException('Error removing story from favorites')

        }
    }
    }

    /**
     * Gets the favorites stories from the user
     * @param userid 
     * @returns 
     */
    async getUserFavoriteStories(userid: number): Promise<Favorite[]> {
        try {
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
        } catch (error) {
            throw new InternalServerErrorException('Error getting the user favorite stories');
        }
        
    }
    
    /**
     * Checks if the user is the author of a story
     * It validates both the add and remove functions...
     * ...allowing only stories not owned by the logged user to be favorited
     * @param userid 
     * @param storyid 
     * @returns 
     */
    async checkIfUserIsAuthor(userid: number, storyid: number): Promise<number> {
        try {
            const entityManager = this.favoriteRepository.manager;
            const query = `SELECT COUNT(*) FROM stories where userid = $1 and id = $2`;
            const result = await entityManager.query(query, [userid, storyid]);
            return parseInt(result[0].count, 10);
        } catch (error) {
            throw new InternalServerErrorException('Erro Checking if user is the story author')
        }
    }
}