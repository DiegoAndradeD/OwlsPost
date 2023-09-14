import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'favorites'})
export class Favorite {

    @PrimaryGeneratedColumn('rowid')
    id: number;

    @Column({name: 'userid', nullable: false})
    userid: number;

    @Column({name: 'storyid', nullable: false})
    storyid: number;
}
