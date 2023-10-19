/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prettier/prettier */
import { Follower } from "../../Follower/Entities/follower.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn('rowid')
    id: Number;

    @Column({name: 'username', nullable: false, unique: true})
    username: string;

    @Column({name: 'email', nullable: false})
    email: string;

    @Column({name: 'password', nullable: false})
    password: string;

    @Column({name: 'created_at'})
    created_at: Date;

    @OneToMany(() => Follower, (follower) => follower.following)
    followers: Follower[];

    @Column({name: 'description', nullable: true})
    description: string;
    
    followers_count: number;

    @Column({name: 'token', nullable: false})
    token: string;
}