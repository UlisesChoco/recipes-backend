import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "../entity/rating.entity";
import { Repository } from "typeorm";
import { RatingMapper } from "../mapper/rating.mapper";
import { RatingDTO } from "../dto/rating.dto";
import { RecipeService } from "src/recipe/service/recipe.service";
import { RatingUserDTO } from "../dto/rating-user.dto";

@Injectable()
export class RatingService {
    private readonly logger = new Logger(RatingService.name);

    constructor(
        @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>,
        private readonly recipeService: RecipeService
    ) { }

    async findByUserIdAndRecipeId(
        userId: number,
        recipeId: number
    ): Promise<Rating | null> {
        const rating = await this.ratingRepository.findOne({
            where: {
                user: { id: userId },
                recipe: { id: recipeId }
            }
        });

        this.logger.log(`Rating found for user with id ${userId} and recipe with id ${recipeId}: ${!!rating}`);
        return rating
    }

    async create(
        score: number,
        comment: string,
        userId: number,
        recipeId: number
    ): Promise<RatingDTO> {
        const recipeExists = await this.recipeService.existsById(recipeId);
        if (!recipeExists)
            throw new NotFoundException('Recipe not found');

        let rating: Rating | null = await this.findByUserIdAndRecipeId(userId, recipeId);

        if (rating) {
            rating.score = score;
            rating.comment = comment;
        } else {
            rating = await this.ratingRepository.create({
                score,
                comment,
                user: { id: userId },
                recipe: { id: recipeId }
            });
        }

        const savedEntity = await this.ratingRepository.save(rating);
        
        this.logger.log(`Rating created/updated successfully for user with id ${userId} and recipe with id ${recipeId}`);

        return RatingMapper.toRatingDTO(savedEntity);
    }

    async findByRecipeId(
        recipeId: number
    ): Promise<RatingUserDTO[]> {
        const ratings = await this.ratingRepository.find({
            where: {
                recipe: { id: recipeId }
            },
            relations: ['user']
        });

        this.logger.log(`Ratings found for recipe with id ${recipeId}: ${ratings.length}`);
        return ratings.map(rating => RatingMapper.toRatingUserDTO(rating));
    }
}