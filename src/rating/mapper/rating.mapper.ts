import { RatingUserDTO } from "../dto/rating-user.dto";
import { RatingDTO } from "../dto/rating.dto";
import { Rating } from "../entity/rating.entity";

export class RatingMapper {
    static toRatingDTO(rating: Rating): RatingDTO {
        return new RatingDTO(rating.score, rating.comment);
    }

    static toRatingUserDTO(rating: Rating): RatingUserDTO {
        return new RatingUserDTO(
            rating.score,
            rating.comment,
            {
                name: rating.user.name,
                surname: rating.user.surname
            }
        );
    }
}