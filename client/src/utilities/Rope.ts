import { EmptyRopeException } from '../exceptions/utilities/EmptyRopeException';
import { IndexNotInRopeException } from '../exceptions/utilities/IndexNotInRopeException';
import { InvalidRageForRopeException } from '../exceptions/utilities/InvalidRageForRopeException';
export class Rope{

    private _left: Rope | null;
    private _right: Rope | null;
    private _leftCount: number=0;
    private _substring: string | null; 


    constructor(substring: string);
    constructor(left: Rope, right: Rope);
    constructor(leftOrSubstring: Rope | string,right?: Rope){
        if(typeof leftOrSubstring === "string"){
            this._left = null;
            this._right= null;
            this._substring = leftOrSubstring;
            this._leftCount = leftOrSubstring.length;
        }
        else{
            this._left= leftOrSubstring;
            this._right = right ?? null;
            this._substring = null;
            this._leftCount = leftOrSubstring.leftCount;
        }
    }

    get left(){
        return this._left;
    }

    get right(){
        return this._right;
    }


    get leftCount(){
        return this._leftCount;
    }


    get substring(){
        return this._substring;
    }

    /**
     * Returns the entire string that the rope holds.
     * @returns {string}
     */
    get string(){
        console.log("length: " + this.length)
        return this.report(0,this.length-1)
    }

    /**
     *  Returns the entire length of the string that the rope contains.
     * @returns {number}
     */
    get length(){
        let sum:number = this.leftCount;
        if(this.left !== null) {
            dfsSum(this.right);
        }

        /**
         * @param {Rope | null} r 
         * @returns {void}
         */
        function dfsSum(r:Rope | null){
            if (r !== null){
                sum += r.leftCount;
                dfsSum(r.right);
            } 
        }
        return sum;
    }

    private set left(left: Rope | null){
        this._left = left; 
    }
    
    private set right(right:Rope | null){
        this._right = right; 
    }

    private set leftCount(leftCount: number){
        this._leftCount = leftCount;
    }
    
    private set substring(substring: string | null){
        this._substring = substring; 
    }

    /**
     * Finds the ith postion charcter in the rope. 
     * @param {number} i 
     * @returns {string}
     */
    search(i:number){

        /**
         * @param {Rope}r
         * @param {number} j
         * @returns {string}
         */
        function dfs(r:Rope,j:number){ 
            // left case 
            if (j <r.leftCount &&r.left !== null){ 
                return dfs(r.left,j);
            } // right case 
            else if(j>r.leftCount &&r.right !== null){
                return dfs(r.right,j-r.leftCount); // postion of char is in
            } // relation tor.right is j-s.leftCount
            else if (r.left === null && r.right === null 
                &&r.substring !== null && j<r.leftCount && j >=0){
                return r.substring[j];
            }
            else{
                throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
            }
        }
        return dfs(this,i);
    }
    
    /**
     * Joins current rope with r into a single rope. 
     * @param {Rope | null} r 
     * @returns {Rope}
     */
    concatiante(r: Rope | null){
        if( r !== null){
            let newLeftCount: number = this.length;
            let newRope: Rope = new Rope(this,r);
            newRope.leftCount = newLeftCount;
            return newRope
        }
        else{
            throw new EmptyRopeException();
        }
    }

    /**
     * Cuts the given rope into two ropes: 
     * r1 from [0,i] and r2 from (i,n-1]. Then 
     * it returns an array of the two given ropes. 
     * @param {number} i 
     * @returns {Array<Rope>}
     */
    split(i:number){

    }

    /**
     * Places the new given Rope at the ith index. 
     * @param {number} i 
     * @param {Rope} s 
     * @returns {void}
     */
    insert(i:number,r: Rope | null){

    }

    /**
     * Removes the string from [i,j].
     * @param {number} i 
     * @param {number} j 
     */
    delete(i:number,j:number){

    }

    /**
     * Gives the string from [i,j]. 
     * @param {number} i 
     * @param {number} j 
     * @returns {string}
     */
    report(i:number,j:number){
        console.log();
        console.log();
        console.log();
        console.log();
        let partitions: string[] = [];
        let charLeft: number = j-i +1;
        if (charLeft <= 0)  throw new InvalidRageForRopeException(i, j);
        
        function dfs(r:Rope,start:number){
            // left case 
            if (start <r.leftCount &&r.left !== null){ 
                if(r.leftCount - start < charLeft && r.right !== null){ // right call because, there are 
                    console.log("Adding right substring at given leftCount: " + r.leftCount );
                    dfs(r.left,start);
                    dfs(r.right,0); // more chars left outside of the left calls window. 
                }else{
                    dfs(r.left,start);
                }
            } // right case 
            else if(j>r.leftCount &&r.right !== null){
                  dfs(r.right,start-r.leftCount); // postion of char is in
                  // relation tor.right is j-s.leftCount
            } 
            else if (r.left === null && r.right === null 
                && r.substring !== null && start<r.leftCount){

                let subString: string = r.substring;
                let len: number = subString.length;
                let end: number = start + Math.min(charLeft,len-start);
                charLeft -= (end-start); 
                console.log("new charLeft: " +charLeft);
                console.log("substring being added: " + subString.slice(start,end));
                partitions.push(subString.slice(start,end));
            }
            else{
                throw new IndexNotInRopeException(i,j,r.substring?.length ??0);
            }
        }
        dfs(this,i);
        console.log("final charLeft: " +charLeft);
        return partitions.join("");
    }

}   