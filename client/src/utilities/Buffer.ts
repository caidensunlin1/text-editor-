import { NegativeIndexException } from "../exceptions/utilities/Rope/NegativeIndexException";
import { MAX_LENGTH } from "./Constants";

export class Buffer{
    private _buffer: string[]; 
    private _size: number; 

    constructor(){
        this._buffer = new Array(MAX_LENGTH);
        this._size = 0;
    }

    get size(){
        return this._size; 
    }

    private get buffer(){
        return this._buffer;
    }

    private set size(size:number){
        this._size =size;
    }

    /**
     * Adds the chars of a string to the buffer.
     * This does not worry about the string as its 
     * self as that will be handled in the text editor itself.
     * 
     * @param s 
     */
    add(s:string): void{
        
        Array.from(s).forEach(char =>
        {
            this.buffer[this.size] = char;
            this.size++; 
        });
    }

    /**
     * 
     * @param charsRemoved 
     */
    remove(charsRemoved:number): void{
        if (charsRemoved > this.size) 
            throw new NegativeIndexException(charsRemoved);
        this.size -= charsRemoved;
    }

    flush(): string{
        const FINAL_SIZE= this.size;
        this.size =0;
        return this.buffer.slice(0,FINAL_SIZE).join("");
    }
}