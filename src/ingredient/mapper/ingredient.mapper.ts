import { IngredientDTO } from "../dto/ingredient.dto";
import { Ingredient } from "../entity/ingredient.entity";

export class IngredientMapper {
    static toIngredientDTO(entity: Ingredient): IngredientDTO {
        return new IngredientDTO(
            entity.name,
            entity.amount,
            entity.unit
        );
    }   
}