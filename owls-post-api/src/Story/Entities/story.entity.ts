import { User } from "src/User/Entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({name: 'username', nullable: false})
    username: string;

    @Column({name: 'created_at'})
    created_at: Date;
}