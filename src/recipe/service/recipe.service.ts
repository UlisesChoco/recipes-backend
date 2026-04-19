import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Recipe } from "../entity/recipe.entity";
import { DataSource, Repository } from "typeorm";
import { RecipeMapper } from "../mapper/recipe.mapper";
import { RecipeDTO } from "../dto/recipe.dto";
import { CreateRecipeDTO } from "../dto/create-recipe.dto";
import { Ingredient } from "../../ingredient/entity/ingredient.entity";
import { UpdateRecipeDTO } from "../dto/update-recipe.dto";
import { RecipeWithIngredientsDTO } from "../dto/recipe-with-ingredients.dto";
import { IngredientDTO } from "src/ingredient/dto/ingredient.dto";
import { deleteImage, saveImage } from "src/common/util/image-functions";

@Injectable()
export class RecipeService {
    constructor(
        @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
        private readonly dataSource: DataSource
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

    async findByIdAndUserId(
        id: number,
        userId: number
    ): Promise<Recipe> {
        const entity: Recipe | null = await this.recipeRepository.findOne({
            where: {
                id: id,
                user: {
                    id: userId
                }
            }
        });

        if (!entity)
            throw new NotFoundException();

        return entity;
    }

    async create(
        userId: number,
        image: any,
        dto: CreateRecipeDTO
    ): Promise<RecipeWithIngredientsDTO> {
        if (dto.ingredients && dto.ingredients.length === 0)
            throw new BadRequestException("Recipe must have at least one ingredient");

        const imageFilePath = await saveImage(image);

        try {
            const savedRecipe: Recipe = await this.dataSource.transaction(async (manager) => {
                const recipeRepository = manager.getRepository(Recipe);
                const ingredientRepository = manager.getRepository(Ingredient);

                const recipe = recipeRepository.create({
                    title: dto.title,
                    description: dto.description,
                    image: imageFilePath,
                    user: {
                        id: userId,
                    },
                });
                
                const savedRecipe = await recipeRepository.save(recipe);

                const ingredients = this.createIngredients(dto.ingredients ?? [], savedRecipe.id, ingredientRepository);

                const savedIngredients = await ingredientRepository.save(ingredients);

                savedRecipe.ingredients = savedIngredients;

                return savedRecipe;
            });

            return RecipeMapper.toRecipeWithIngredientsDTO(savedRecipe);
        } catch (error) {
            await deleteImage(imageFilePath);
            throw error;
        }
    }

    async update(
        userId: number,
        id: number,
        image: any,
        dto: UpdateRecipeDTO
    ): Promise<RecipeWithIngredientsDTO> {
        if (dto.ingredients && dto.ingredients.length === 0)
            throw new BadRequestException("Recipe must have at least one ingredient");

        const recipe = await this.findByIdAndUserId(id, userId);
        const oldImagePath = recipe.image;
        let newImagePath: string | null = null;

        if (image) newImagePath = await saveImage(image);

        try {
            await this.dataSource.transaction(async (manager) => {
                const recipeRepository = manager.getRepository(Recipe);
                const ingredientRepository = manager.getRepository(Ingredient);

                await recipeRepository.update(recipe.id, {
                    title: dto.title,
                    description: dto.description,
                    image: newImagePath ?? oldImagePath,
                });

                await ingredientRepository.delete({ recipe: { id: id } });

                const ingredients = this.createIngredients(dto.ingredients ?? [], id, ingredientRepository);

                await ingredientRepository.save(ingredients);
            });

            if (newImagePath && oldImagePath) await deleteImage("/app/uploads/"+oldImagePath);
        } catch (error) {
            if (newImagePath) await deleteImage("/app/uploads/"+newImagePath);

            throw error;
        }

        const updated = await this.recipeRepository.findOne({
            where: { id },
            relations: ['ingredients']
        });

        return RecipeMapper.toRecipeWithIngredientsDTO(updated!);
    }

    private createIngredients(
        ingredients: IngredientDTO[],
        recipeId: number,
        ingredientRepository: Repository<Ingredient>
    ): Ingredient[] {
        return ingredients.map(ingredient =>
                ingredientRepository.create({
                    ...ingredient,
                    recipe: { id: recipeId }
                })
            );
    }
}