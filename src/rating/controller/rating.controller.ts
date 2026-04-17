import { Controller } from "@nestjs/common";
import { RatingService } from "../service/rating.service";

@Controller('ratings')
export class RatingController {
    constructor(
        private readonly ratingService: RatingService
    ) { }
}