import { Ingredient } from "src/ingredient/entity/ingredient.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recipe {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        length: 100,
        nullable: false
    })
    title!: string;

    @Column({
        length: 255,
        nullable: false
    })
    description!: string;

    @Column({
        length: 255,
        nullable: false
    })
    image!: string;

    @ManyToOne(() => User, (user) => user.recipes)
    user!: User;

    @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
    ingredients!: Ingredient[];
}