import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { RatingService } from "../service/rating.service";
import { RateRecipeDTO } from "../dto/rate-recipe.dto";
import { RatingDTO } from "../dto/rating.dto";
import { JwtGuard } from "src/common/guard/jwt.guard";
import { RatingUserDTO } from "../dto/rating-user.dto";

@Controller()
export class RatingController {
    constructor(
        private readonly ratingService: RatingService
    ) { }

    @Post('ratings')
    @HttpCode(201)
    @UseGuards(JwtGuard)
    async rateRecipe(
        @Req() request: any,
        @Body() body: RateRecipeDTO
    ): Promise<RatingDTO> {
        return await this.ratingService.create(
            body.score,
            body.comment,
            request.user.sub,
            body.recipeId
        );
    }

    @Get('recipes/:recipeId/ratings')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    async getRatingsForRecipe(
        @Param('recipeId', ParseIntPipe) recipeId: number
    ): Promise<RatingUserDTO[]> {
        return await this.ratingService.findByRecipeId(recipeId);
    }
}