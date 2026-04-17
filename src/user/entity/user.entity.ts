import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 20,
        nullable: false
    })
    name!: string;

    @Column({
        length: 20,
        nullable: false
    })
    surname!: string;

    @Column({
        length: 255,
        nullable: false
    })
    password!: string;

    @Column({
        length: 50,
        nullable: false,
        unique: true
    })
    email!: string;

    @Column({
        default: false,
        nullable: false
    })
    verified!: boolean;
}