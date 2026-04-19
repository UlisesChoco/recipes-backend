import { IsNumber, IsString, Length } from "class-validator";

export class IngredientDTO {
    @IsString()
    @Length(1, 50)
    name!: string;

    @IsNumber()
    amount!: number;

    @IsString()
    @Length(1, 10)
    unit!: string;
    
    constructor(
        name: string,
        amount: number,
        unit: string
    ) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
}