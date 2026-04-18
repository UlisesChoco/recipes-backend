import { Controller, Get, HttpCode, Req, Res, UseGuards } from "@nestjs/common";
import { RecipeService } from "../service/recipe.service";
import { JwtGuard } from "src/common/guard/jwt.guard";

@Controller('recipes')
export class RecipeController {
    constructor(
        private readonly recipeService: RecipeService
    ) { }

    @Get('me')
    @HttpCode(200)
    @UseGuards(JwtGuard)
    async retrieveMyRecipes(
        @Req() req: any
    ) {
        return await this.recipeService.findByUserId(req.user.sub);
    }
}