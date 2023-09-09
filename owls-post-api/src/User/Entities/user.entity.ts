import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}