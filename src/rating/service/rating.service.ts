import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Rating } from "../entity/rating.entity";
import { Repository } from "typeorm/browser/repository/Repository.js";

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>
    ) { }
}