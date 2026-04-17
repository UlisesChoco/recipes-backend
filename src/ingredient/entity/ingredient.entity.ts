import { Recipe } from "src/recipe/entity/recipe.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Recipe, (recipe) => recipe.ingredients)
    recipe!: Recipe;
}