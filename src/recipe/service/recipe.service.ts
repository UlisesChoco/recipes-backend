import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Recipe } from "../entity/recipe.entity";
import { Repository } from "typeorm/browser/repository/Repository.js";

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>
    ) { }
}