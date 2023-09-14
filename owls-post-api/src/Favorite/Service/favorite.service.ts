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
    
}