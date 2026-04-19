import { IsNumber, IsPositive, IsString, Length, Max, Min } from "class-validator";

export class RateRecipeDTO {
    @IsNumber()
    @Min(1)
    @Max(5)
    score: number;

    @IsString()
    @Length(0, 255)
    comment: string;

    @IsNumber()
    @IsPositive()
    recipeId: number;

    constructor(
        score: number,
        comment: string,
        recipeId: number
    ) {
        this.score = score;
        this.comment = comment;
        this.recipeId = recipeId;
    }
}