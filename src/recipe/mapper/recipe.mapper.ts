import { IngredientMapper } from "src/ingredient/mapper/ingredient.mapper";
import { RecipeDTO } from "../dto/recipe.dto";
import { UpdateRecipeDTO } from "../dto/update-recipe.dto";
import { Recipe } from "../entity/recipe.entity";
import { CreateRecipeDTO } from "../dto/create-recipe.dto";
import { RecipeWithIngredientsDTO } from "../dto/recipe-with-ingredients.dto";
import { RecipeWithUserDTO } from "../dto/recipe-with-user.dto";
import { RecipeWithUserAndIngredientsDTO } from "../dto/recipe-with-user-and-ingredients.dto";

export class RecipeMapper {
    static toRecipeDTO(entity: Recipe): RecipeDTO {
        return new RecipeDTO(
            entity.id,
            entity.title,
            entity.description,
            entity.image
        );
    }

    static toUpdateRecipeDTO(entity: Recipe): UpdateRecipeDTO {
        return new UpdateRecipeDTO(
            entity.title,
            entity.description,
            entity.ingredients.map(ingredient => IngredientMapper.toIngredientDTO(ingredient))
        );
    }

    static toCreateRecipeDTO(entity: Recipe): CreateRecipeDTO {
        return new CreateRecipeDTO(
            entity.title,
            entity.description,
            entity.ingredients.map(ingredient => IngredientMapper.toIngredientDTO(ingredient))
        );
    }

    static toRecipeWithIngredientsDTO(entity: Recipe): RecipeWithIngredientsDTO {
        return new RecipeWithIngredientsDTO(
            entity.title,
            entity.description,
            entity.image,
            entity.ingredients.map(ingredient => IngredientMapper.toIngredientDTO(ingredient))
        );
    }

    static toRecipeWithUserDTO(entity: Recipe): RecipeWithUserDTO {
        return new RecipeWithUserDTO(
            entity.id,
            entity.title,
            entity.description,
            entity.image,
            {
                name: entity.user.name,
                surname: entity.user.surname
            }
        );
    }

    static toRecipeWithUserAndIngredientsDTO(entity: Recipe): RecipeWithUserAndIngredientsDTO {
        return new RecipeWithUserAndIngredientsDTO(
            entity.id,
            entity.title,
            entity.description,
            entity.image,
            {
                name: entity.user.name,
                surname: entity.user.surname
            },
            entity.ingredients.map(ingredient => IngredientMapper.toIngredientDTO(ingredient))
        );
    }
}