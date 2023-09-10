import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'stories'})
export class Story {

    @PrimaryGeneratedColumn('rowid')
    id: Number;

    @Column({name: 'title', nullable: false, unique: true})
    title: string;

    @Column({name: 'description', nullable: false})
    description: string;

    @Column({name: 'authorId', nullable: false})
    authorId: number;

    @Column({name: 'authorName', nullable: false})
    authorName: string;

    @Column({name: 'created_at'})
    created_at: Date;
}