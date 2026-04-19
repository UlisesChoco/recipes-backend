export class RatingUserDTO {
    score: number;
    comment: string;
    user: {
        name: string;
        surname: string;
    };

    constructor(
        score: number,
        comment: string,
        user: {
            name: string;
            surname: string;
        }
    ) {
        this.score = score;
        this.comment = comment;
        this.user = user;
    }
}
