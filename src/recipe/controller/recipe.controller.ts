import { Controller } from "@nestjs/common";
import { RecipeService } from "../service/recipe.service";

@Controller('recipes')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService
    ) { }
}