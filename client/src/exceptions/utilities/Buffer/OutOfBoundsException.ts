export class OutOfBoundsException extends Error{
    private index: number;
    constructor(index: number){
        super(`Index: ${index} is not in the buffer.`);
        this.index = index;
        Object.freeze(this);
    }
}