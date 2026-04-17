import { TypeOrmModule } from "@nestjs/typeorm";
import { IngredientController } from "./controller/ingredient.controller";
import { Ingredient } from "./entity/ingredient.entity";
import { IngredientService } from "./service/ingredient.service";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService]
})
export class IngredientModule {}