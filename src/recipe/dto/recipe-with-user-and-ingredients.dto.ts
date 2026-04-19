import { IngredientDTO } from "src/ingredient/dto/ingredient.dto";

export class RecipeWithUserAndIngredientsDTO {
    id: number;
    title: string;
    description: string;
    image: string;
    user: {
        name: string;
        surname: string;
    }
    ingredients: IngredientDTO[];

    constructor(
        id: number,
        title: string,
        description: string,
        image: string,
        user: {
            name: string;
            surname: string;
        },
        ingredients: IngredientDTO[]
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.user = user;
        this.ingredients = ingredients;
    }
}