export class RatingDTO {
    score: number;
    comment: string

    constructor(
        score: number,
        comment: string
    ) {
        this.score = score;
        this.comment = comment;
    }
}