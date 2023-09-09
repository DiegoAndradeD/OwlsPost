import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User {

    @PrimaryGeneratedColumn('rowid')
    id: Number;

    @Column({name: 'username', nullable: false, unique: true})
    usernmae: string;

    @Column({name: 'email', nullable: false})
    email: string;

    @Column({name: 'passoword', nullable: false})
    password: string;

    @Column({name: 'created_at'})
    created_at: Date;
}