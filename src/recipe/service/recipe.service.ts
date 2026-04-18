import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Recipe } from "../entity/recipe.entity";
import { Repository } from "typeorm";
import { RecipeMapper } from "../mapper/recipe.mapper";
import { RecipeDTO } from "../dto/recipe.dto";

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>
    ) { }

    async findByUserId(
        userId: number
    ): Promise<RecipeDTO[]> {
        const entities: Recipe[] = await this.recipeRepository.find({
            where: {
                user: {
                    id: userId
                }
            }
        });

        return entities.map(entity => RecipeMapper.toRecipeDTO(entity));
    }
}