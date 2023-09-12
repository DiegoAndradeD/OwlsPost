import { User } from "src/User/Entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'followers'})
export class Follower {

    @PrimaryGeneratedColumn('rowid')
    id: number;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'followerid'})
    follower: User;

    @ManyToOne(() => User, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'followingid'})
    following: User;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;
}