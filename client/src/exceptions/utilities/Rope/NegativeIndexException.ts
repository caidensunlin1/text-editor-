export class NegativeIndexException extends Error{
    index: number;

    constructor(index: number){
        super(`The following index: ${index} is negative.`);
        this.index = index;
    }
    
}