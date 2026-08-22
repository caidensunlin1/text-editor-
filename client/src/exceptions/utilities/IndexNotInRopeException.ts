export class IndexNotInRopeException extends Error {
    index: number; 
    subIndex: number; 
    substringLength: number;

    constructor(index:number,subIndex: number,substringLength: number){
    super(`Index: ${index} not contained in string. Failed to find: ${subIndex} in substring of length: ${substringLength}`);
    this.index = index; 
    this.subIndex = subIndex;
    this.substringLength = substringLength;
    this.name = this.constructor.name;
    Object.freeze(this);
    }


}