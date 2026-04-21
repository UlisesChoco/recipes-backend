import { Recipe } from "src/recipe/entity/recipe.entity";
import { Rating } from "src/rating/entity/rating.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt!: Date;

    @OneToMany(() => Recipe, (recipe) => recipe.user)
    recipes!: Recipe[];

    @OneToMany(() => Rating, (rating) => rating.user)
    ratings!: Rating[];
}