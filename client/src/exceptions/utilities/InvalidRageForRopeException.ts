export class InvalidRageForRopeException extends Error{
    a: number; 
    b: number; 

    constructor(a:number,b:number){
        super(`Starting index: ${a} is greater than ending index: ${b}.`);
        this.a = a;
        this.b = b; 
    }
}