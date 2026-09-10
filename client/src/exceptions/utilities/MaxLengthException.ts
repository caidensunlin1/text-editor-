import { MAX_LENGTH } from "../../utilities/Constants";

export class MaxLengthException extends Error{
    subStringLen: number;

    constructor(subStringLen:number){
        super(`substring has a legnth of ${subStringLen} which is greater than the max length: ${MAX_LENGTH}`);
        this.subStringLen = subStringLen;
        Object.freeze(this);
    }
}