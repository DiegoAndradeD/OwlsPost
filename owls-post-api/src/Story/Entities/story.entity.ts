import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'stories'})
export class Story {

    @PrimaryGeneratedColumn('rowid')
    id: Number;

    @Column({name: 'title', nullable: false, unique: true})
    title: string;

    @Column({name: 'description', nullable: false})
    description: string;

    @Column({name: 'userId', nullable: false})
    userId: number;

    @Column({name: 'username', nullable: false})
    username: string;

    @Column({name: 'created_at'})
    created_at: Date;
}