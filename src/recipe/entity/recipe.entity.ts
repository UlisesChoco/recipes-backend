import { Ingredient } from "src/ingredient/entity/ingredient.entity";
import { Rating } from "src/rating/entity/rating.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
    ingredients!: Ingredient[];

    @OneToMany(() => Rating, (rating) => rating.recipe)
    ratings!: Rating[];
}