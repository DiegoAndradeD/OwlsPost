import { Controller, Get } from "@nestjs/common";
import { Favorite } from "../Entity/favorite.entity";
import { FavoriteService } from "../Service/favorite.service";


@Controller('favorite')
export class FavoriteController {

    constructor(private readonly favoriteService: FavoriteService){}
    
    @Get()
    async getAllFavorites(): Promise<Favorite[]> {
        return this.favoriteService.getAllFavorites();
    }
}