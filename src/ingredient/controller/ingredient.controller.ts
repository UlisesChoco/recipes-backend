import { Controller } from "@nestjs/common";
import { IngredientService } from "../service/ingredient.service";

@Controller('ingredients')
export class IngredientController {
    constructor(
        private readonly ingredientService: IngredientService
    ) { }
}