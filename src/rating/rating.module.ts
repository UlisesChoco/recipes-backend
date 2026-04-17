import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingController } from "./controller/rating.controller";
import { Rating } from "./entity/rating.entity";
import { RatingService } from "./service/rating.service";
import { Module } from "@nestjs/common/decorators/modules/module.decorator";

@Module({
  imports: [TypeOrmModule.forFeature([Rating])],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService]
})
export class RatingModule {}