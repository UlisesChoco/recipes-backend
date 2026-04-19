import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { RecipeService } from "../service/recipe.service";
import { JwtGuard } from "src/common/guard/jwt.guard";
import { CreateRecipeDTO } from "../dto/create-recipe.dto";
import { UpdateRecipeDTO } from "../dto/update-recipe.dto";
import { RecipeDTO } from "../dto/recipe.dto";
import { RecipeWithIngredientsDTO } from "../dto/recipe-with-ingredients.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MultipartTransformInterceptor } from "src/common/interceptor/multipart-transform.interceptor";

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
    ): Promise<RecipeDTO[]> {
        return await this.recipeService.findByUserId(req.user.sub);
    }

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('image'), MultipartTransformInterceptor)
    @UseGuards(JwtGuard)
    async create(
        @Req() req: any,
        @UploadedFile() image: any,
        @Body() body: CreateRecipeDTO
    ): Promise<RecipeWithIngredientsDTO> {
        return await this.recipeService.create(req.user.sub, image, body);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('image'), MultipartTransformInterceptor)
    @UseGuards(JwtGuard)
    async update(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() image: any,
        @Body() body: UpdateRecipeDTO
    ): Promise<RecipeWithIngredientsDTO> {
        return await this.recipeService.update(req.user.sub, id, image, body);
    }
}