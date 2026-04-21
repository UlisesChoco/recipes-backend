import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
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
import { RecipeWithUserDTO } from "../dto/recipe-with-user.dto";
import { RecipeWithUserAndIngredientsDTO } from "../dto/recipe-with-user-and-ingredients.dto";
import { Rating } from "src/rating/entity/rating.entity";

@Injectable()
export class RecipeService {
    private readonly logger = new Logger(RecipeService.name);

    constructor(
        @InjectRepository(Recipe) private readonly recipeRepository: Repository<Recipe>,
        private readonly dataSource: DataSource
    ) { }

    async existsById(
        id: number
    ): Promise<boolean> {
        this.logger.log(`Checking if recipe with id ${id} exists`);
        return await this.recipeRepository.existsBy({ id });
    }
    
    async findById(
        id: number
    ): Promise<RecipeWithUserAndIngredientsDTO> {
        const entity: Recipe | null = await this.recipeRepository.findOne({
            where: { id: id },
            relations: ['user', 'ingredients']
        });

        if (!entity) {
            this.logger.error(`Recipe with id ${id} not found`);
            throw new NotFoundException();
        }

        this.logger.log(`Recipe with id ${id} found: ${entity.title}`);
        return RecipeMapper.toRecipeWithUserAndIngredientsDTO(entity);
    }

    async findAll(): Promise<RecipeWithUserDTO[]> {
        const entities: Recipe[] = await this.recipeRepository.find({
            relations: ['user']
        });

        this.logger.log(`Found ${entities.length} recipes`);
        return entities.map(entity => RecipeMapper.toRecipeWithUserDTO(entity));
    }

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

        this.logger.log(`Found ${entities.length} recipes for user with id ${userId}`);
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

        if (!entity) {
            this.logger.error(`Recipe with id ${id} not found`);
            throw new NotFoundException();
        }

        this.logger.log(`Recipe with id ${id} found for user with id ${userId}: ${entity.title}`);
        return entity;
    }

    async create(
        userId: number,
        image: any,
        dto: CreateRecipeDTO
    ): Promise<RecipeWithIngredientsDTO> {
        if (dto.ingredients && dto.ingredients.length === 0) {
            this.logger.error("Recipe must have at least one ingredient");
            throw new BadRequestException("Recipe must have at least one ingredient");
        }

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

            this.logger.log(`Recipe created successfully: ${savedRecipe.title}`);
            return RecipeMapper.toRecipeWithIngredientsDTO(savedRecipe);
        } catch (error) {
            this.logger.error("Error occurred while creating recipe: " + error);
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

            this.logger.log(`Recipe with id ${id} updated successfully for user with id ${userId}`);
        } catch (error) {
            if (newImagePath) await deleteImage("/app/uploads/"+newImagePath);

            this.logger.error(`Error occurred while updating recipe with id ${id} for user with id ${userId}: ` + error);

            throw error;
        }

        const updated = await this.recipeRepository.findOne({
            where: { id },
            relations: ['ingredients']
        });

        return RecipeMapper.toRecipeWithIngredientsDTO(updated!);
    }

    async delete(
        userId: number,
        id: number
    ): Promise<void> {
        await this.dataSource.transaction(async (manager) => {
            const recipeRepository = manager.getRepository(Recipe);
            const ingredientRepository = manager.getRepository(Ingredient);
            const ratingRepository = manager.getRepository(Rating);

            const recipe = await this.findByIdAndUserId(id, userId);

            if (!recipe) {
                this.logger.error(`Recipe with id ${id} not found for user with id ${userId}`);
                throw new NotFoundException('Recipe not found');
            }

            await ingredientRepository.delete({ recipe: { id: id } });
            await ratingRepository.delete({ recipe: { id: id } });
            await recipeRepository.delete({ id: id });

            this.logger.log(`Recipe with id ${id} deleted successfully for user with id ${userId}`);
            if (recipe.image) await deleteImage("/app/uploads/"+recipe.image);
        });
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