import { Recipe } from "src/recipe/entity/recipe.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rating {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false
    })
    score!: number;

    @Column({
        length: 255,
        nullable: false
    })
    comment!: string;

    @ManyToOne(() => Recipe, (recipe) => recipe.ratings)
    recipe!: Recipe;

    @ManyToOne(() => User, (user) => user.ratings)
    user!: User;
}