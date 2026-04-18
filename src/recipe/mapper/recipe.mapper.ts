import { RecipeDTO } from "../dto/recipe.dto";
import { Recipe } from "../entity/recipe.entity";

export class RecipeMapper {
    static toRecipeDTO(entity: Recipe): RecipeDTO {
        return new RecipeDTO(
            entity.id,
            entity.title,
            entity.description,
            entity.image
        );
    }
}