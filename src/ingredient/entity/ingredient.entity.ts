import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ingredient {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 50,
        nullable: false
    })
    name!: string;

    @Column({
        nullable: false
    })
    amount!: number;

    @Column({
        length: 10,
        nullable: false
    })
    unit!: string;
}