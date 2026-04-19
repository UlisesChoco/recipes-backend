import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingController } from "./controller/rating.controller";
import { Rating } from "./entity/rating.entity";
import { RatingService } from "./service/rating.service";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { RecipeModule } from "src/recipe/recipe.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Rating]),
    RecipeModule
  ],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {}