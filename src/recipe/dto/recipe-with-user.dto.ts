export class RecipeWithUserDTO {
    id: number;
    title: string;
    description: string;
    image: string;
    user: {
        name: string;
        surname: string;
    }

    constructor(
        id: number,
        title: string,
        description: string,
        image: string,
        user: {
            name: string;
            surname: string;
        }
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.image = image;
        this.user = user;
    }
}