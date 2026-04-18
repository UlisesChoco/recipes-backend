import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ingredient } from "../entity/ingredient.entity";
import { Repository } from "typeorm";

@Injectable()
export class IngredientService {
    constructor(
        @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>
    ) { }
}