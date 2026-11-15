export class EmptyRopeException extends Error{
    constructor(){
    super(`Rope has no content`);
    this.name = this.constructor.name;
    Object.freeze(this);
    }
}