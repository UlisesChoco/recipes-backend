import { IsString, Length, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientDTO } from 'src/ingredient/dto/ingredient.dto';

export class UpdateRecipeDTO {
    @IsString()
    @Length(1, 100)
    title: string;

    @IsString()
    @Length(1, 255)
    description: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => IngredientDTO)
    ingredients: IngredientDTO[];

    constructor(
        title: string,
        description: string,
        ingredients: IngredientDTO[]
    ) {
        this.title = title;
        this.description = description;
        this.ingredients = ingredients;
    }
}