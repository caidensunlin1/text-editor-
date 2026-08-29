export class NoSubstringException extends Error{
    constructor(){
    super(`No substring in leaf.`);
    this.name = this.constructor.name;
    }
}