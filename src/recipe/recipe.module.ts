import { TypeOrmModule } from "@nestjs/typeorm";
import { RecipeController } from "./controller/recipe.controller";
import { Recipe } from "./entity/recipe.entity";
import { RecipeService } from "./service/recipe.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  controllers: [RecipeController],
  providers: [RecipeService],
  exports: [RecipeService]
})
export class RecipeModule {}