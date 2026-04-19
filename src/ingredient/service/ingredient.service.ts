import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ingredient } from "../entity/ingredient.entity";
import { Repository } from "typeorm";
import { IngredientDTO } from "../dto/ingredient.dto";
import { IngredientMapper } from "../mapper/ingredient.mapper";

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>
    ) { }

    async create(
        recipeId: number,
        dto: IngredientDTO
    ): Promise<IngredientDTO> {
        const entity: Ingredient = this.ingredientRepository.create({
            name: dto.name,
            amount: dto.amount,
            unit: dto.unit,
            recipe: {
                id: recipeId
            }
        });

        const savedEntity = await this.ingredientRepository.save(entity);

        return IngredientMapper.toIngredientDTO(savedEntity);
    }
}