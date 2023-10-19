import { Chapter } from "../../Chapter/Entities/chapter.entity";
import { User } from "../../User/Entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'stories'})
export class Story {

    @PrimaryGeneratedColumn('rowid')
    id: Number;

    @Column({name: 'title', nullable: false, unique: true})
    title: string;

    @Column({name: 'description', nullable: false})
    description: string;

    
    @ManyToOne(() => User, (User) => User.id, {cascade: true})
    @JoinColumn({name: 'userid'})
    userid: number;

    @OneToMany(() => Chapter, (chapter) => chapter.story)
    chapters: Chapter[];

    @Column({name: 'username', nullable: false})
    username: string;

    @Column({name: 'created_at'})
    created_at: Date;

    @Column({name: 'tags', type: 'text', array: true, nullable: true})
    tags: string[];
}