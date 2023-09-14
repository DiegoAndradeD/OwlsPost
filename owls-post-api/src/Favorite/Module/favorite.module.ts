import { Module } from "@nestjs/common";
import { FavoriteController } from "../Controller/favorite.controller";
import { FavoriteService } from "../Service/favorite.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Favorite } from "../Entity/favorite.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Favorite])],
    controllers: [FavoriteController],
    providers: [FavoriteService],
    exports: [FavoriteService],
})
export class FavoriteModule{}