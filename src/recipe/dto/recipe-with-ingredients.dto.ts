import { IngredientDTO } from "src/ingredient/dto/ingredient.dto";

export class RecipeWithIngredientsDTO {
    title: string;
    description: string;
    image: string;
    ingredients: IngredientDTO[];

    constructor(
        title: string,
        description: string,
        image: string,
        ingredients: IngredientDTO[]
    ) {
        this.title = title;
        this.description = description;
        this.image = image;
        this.ingredients = ingredients;
    }
}